
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    FlatList,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TCSHeader from '../../components/common/TCSHeader';
import { addIncident, makeIncidentId, type Incident } from '../incidents/__data';

const COLORS = {
  blue700: '#0046BE',
  bg: '#F4F5F7',
  cardBG: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  bubbleUser: '#E0F2FE',
  bubbleBot: '#FFFFFF',
};

type Msg = {
  id: string;
  author: 'user' | 'bot';
  text?: string;
  response?: BotResponse;
  at: number;
};

/* ---------------- Fuzzy intent matching ---------------- */

/** Levenshtein distance for typo tolerance. */
function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/** Two words are "close" if they match exactly or are within a small edit distance. */
function wordsClose(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length >= 4 && b.length >= 4 && (a.includes(b) || b.includes(a))) return true;
  const threshold = Math.max(1, Math.floor(Math.min(a.length, b.length) / 4));
  return editDistance(a, b) <= threshold;
}

/** Does the user's message contain a word close to the given keyword? */
function tokenMatch(tokens: string[], keyword: string): boolean {
  return tokens.some((t) => wordsClose(t, keyword));
}

/** How many of the keyword groups are present (each group = list of synonyms). */
function scoreIntent(tokens: string[], groups: string[][]): number {
  let score = 0;
  for (const group of groups) {
    if (group.some((kw) => tokenMatch(tokens, kw))) score += 1;
  }
  return score;
}

/** Structured, richly-rendered bot response. */
type BotResponse = {
  icon?: string;
  title: string;
  intro?: string;
  steps?: string[];
  bullets?: string[];
  meta?: { label: string; value: string }[];
  footer?: string;
  link?: { label: string; href: string };
  question?: string;
  actions?: { label: string; value: 'yes' | 'no'; primary?: boolean }[];
  incidentCard?: {
    id: string;
    title: string;
    incidentType: string;
    status: string;
    severity: string;
    resolutionETA: string;
    resolutionGroup: string;
    reportedAt: string;
  };
  viewStatusHref?: string;
  tone?: 'info' | 'warning' | 'success';
  instant?: boolean;
};

/** Detect if a message is about a printer paper jam. */
function isPrinterIntent(raw: string): boolean {
  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const printerScore = scoreIntent(tokens, [
    ['printer', 'printers', 'printing', 'print'],
    ['jam', 'jammed', 'jamming', 'jump', 'stuck', 'paper'],
  ]);
  return printerScore >= 2;
}

function printerStep1Response(): BotResponse {
  return {
    icon: '🖨️',
    title: 'I am facing Printer Paper Jam issue',
    tone: 'info',
    intro: "No worries, we'll sort this quickly! Let's start:",
    bullets: [
      "Open it up — lift the top cover or pull the tray out fully. If it's a receipt/POS printer, flip open the top lid.",
    ],
    question: "Done that? Reply yes when you're ready.",
  };
}

function printerStep2Response(): BotResponse {
  return {
    icon: '🖨️',
    title: "Let's get the paper out",
    tone: 'info',
    intro: "Great. Now let's get the paper out:",
    bullets: [
      'Look inside — check the tray, the rollers, and the exit slot for stuck paper.',
      "Pull it out gently in the direction the paper normally feeds (don't yank it backwards).",
    ],
    question: 'Were you able to remove the jammed paper? Reply yes or still stuck.',
  };
}

function printerStep3Response(): BotResponse {
  return {
    icon: '✅',
    title: 'Check the Printer',
    tone: 'info',
    intro: 'Paper cleared! Now let\'s test:',
    bullets: [
      'Try printing a test page to verify the jam is fully cleared.',
    ],
    question: 'Did it print cleanly?',
  };
}

function resolvedResponse(): BotResponse {
  return {
    icon: '🎉',
    title: 'All done — great work!',
    tone: 'success',
    intro: "You're all done! The printer is back up and running. Let me know if there's anything else I can help with.",
  };
}

function noRaiseResponse(): BotResponse {
  return {
    icon: '👍',
    title: 'Okay',
    tone: 'info',
    intro: 'No problem. If the issue comes back, just message me and I can raise an incident anytime.',
  };
}

function isAffirmative(t: string): boolean {
  return /\b(yes|yeah|yep|yup|ya|resolved|resolve|fixed|fix|solved|solve|working|works|done|sorted|great)\b/.test(
    t
  );
}

/** Simple keyword-based response engine backed by the app's incident & appointment data. */
function getBotResponse(raw: string): BotResponse {
  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = normalized.split(/\s+/).filter(Boolean);

  // Greeting
  const greetings = ['hi', 'hii', 'hey', 'hello', 'helo', 'hlo', 'yo', 'hola'];
  if (
    tokens.some((t) => greetings.some((g) => wordsClose(t, g))) ||
    /\bgood (morning|afternoon|evening)\b/.test(normalized)
  ) {
    return {
      icon: '👋',
      title: 'Hello!',
      intro: 'I’m your Store IT Ops Assistant. How can I help you with your tech issue today?',
      tone: 'info',
      instant: true,
    };
  }

  // Intent: Why are checkout operations slower today?
  const checkoutScore = scoreIntent(tokens, [
    ['checkout', 'checkouts', 'pos', 'register', 'registers', 'till', 'lane', 'lanes', 'counter'],
    ['slow', 'slower', 'slowness', 'lag', 'lagging', 'delay', 'delayed', 'down', 'offline', 'issue', 'problem'],
  ]);
  // Also treat generic "operations slow" phrasing as this intent.
  const opsSlow =
    tokenMatch(tokens, 'operation') &&
    ['slow', 'slower', 'slowness', 'delay'].some((w) => tokenMatch(tokens, w));

  if (checkoutScore >= 2 || opsSlow) {
    return {
      icon: '🛒',
      title: 'Checkout Slowdown — POS Terminal 03',
      intro:
        'Checkout operations are slower today because POS Terminal 03 (Checkout 3) is offline due to a hardware failure. The other lanes remain fully operational.',
      meta: [
        { label: 'Incident', value: 'INC00001235' },
        { label: 'Impact', value: 'Checkout 3 offline' },
        { label: 'Resolution ETA', value: 'Today 12:00 PM CET' },
        { label: 'Owner', value: 'Retail EUC Ops' },
      ],
      footer:
        'A Field Tech Engineer is scheduled on-site at 12:00 PM to replace the hardware. Redirect customers to the open checkouts until then.',
      tone: 'warning',
    };
  }

  // Fallback
  return {
    icon: '🤔',
    title: 'I’m not sure about that yet',
    intro:
      'I don’t have specific information on that. Please use the DIY guides or contact IT support for further assistance.',
    tone: 'info',
  };
}

/* ---------------- Rich bot bubble ---------------- */
function RichBotBubble({
  response,
  onAction,
}: {
  response: BotResponse;
  onAction?: (value: 'yes' | 'no', label: string) => void;
}) {
  const toneStyle =
    response.tone === 'warning'
      ? styles.botWarning
      : response.tone === 'success'
      ? styles.botSuccess
      : styles.botInfo;

  return (
    <View style={[styles.botBubble, toneStyle]}>
      {/* Header */}
      <View style={styles.botHeader}>
        {!!response.icon && <Text style={styles.botHeaderIcon}>{response.icon}</Text>}
        <Text style={styles.botHeaderTitle}>{response.title}</Text>
      </View>

      {!!response.intro && <Text style={styles.botIntro}>{response.intro}</Text>}

      {/* Meta chips (key/value) */}
      {response.meta?.length ? (
        <View style={styles.metaWrap}>
          {response.meta.map((m) => (
            <View key={m.label} style={styles.metaRow}>
              <Text style={styles.metaLabel}>{m.label}</Text>
              <Text style={styles.metaValue}>{m.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Numbered steps */}
      {response.steps?.length ? (
        <View style={styles.listWrap}>
          {response.steps.map((s, i) => (
            <View key={`step-${i}`} style={styles.listRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.listText}>{s}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Bullets */}
      {response.bullets?.length ? (
        <View style={styles.listWrap}>
          {response.bullets.map((b, i) => (
            <View key={`bul-${i}`} style={styles.listRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.listText}>{b}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Footer tip */}
      {!!response.footer && (
        <View style={styles.footerBox}>
          <Text style={styles.footerIcon}>💡</Text>
          <Text style={styles.footerText}>{response.footer}</Text>
        </View>
      )}

      {/* Clickable link */}
      {response.link && (
        <Pressable
          style={styles.linkBtn}
          onPress={() => router.push(response.link!.href as any)}
          accessibilityRole="link"
        >
          <Text style={styles.linkIcon}>📖</Text>
          <Text style={styles.linkText}>{response.link.label}</Text>
          <Text style={styles.linkChevron}>›</Text>
        </Pressable>
      )}

      {/* Follow-up question */}
      {!!response.question && <Text style={styles.botQuestion}>{response.question}</Text>}

      {/* Quick-reply action buttons */}
      {response.actions?.length ? (
        <View style={styles.actionsRow}>
          {response.actions.map((a) => (
            <Pressable
              key={a.label}
              style={[styles.actionBtn, a.primary ? styles.actionBtnPrimary : styles.actionBtnGhost]}
              onPress={() => onAction?.(a.value, a.label)}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.actionBtnText,
                  a.primary ? styles.actionBtnTextPrimary : styles.actionBtnTextGhost,
                ]}
              >
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Raised incident card */}
      {response.incidentCard && (
        <View style={styles.incidentCard}>
          <View style={styles.incidentCardHeader}>
            <Text style={styles.incidentCardHeaderIcon}>🖨️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.incidentCardId}>{response.incidentCard.id}</Text>
              <Text style={styles.incidentCardTitle}>{response.incidentCard.title}</Text>
            </View>
          </View>

          <View style={styles.incidentBadgesRow}>
            <View style={[styles.incidentBadge, { backgroundColor: '#FDE68A' }]}>
              <Text style={[styles.incidentBadgeText, { color: '#92400E' }]}>
                {response.incidentCard.status}
              </Text>
            </View>
            <View style={[styles.incidentBadge, { backgroundColor: '#ffde58' }]}>
              <Text style={[styles.incidentBadgeText, { color: '#7c5e00' }]}>
                {response.incidentCard.severity}
              </Text>
            </View>
          </View>

          <View style={styles.metaWrap}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Incident Type</Text>
              <Text style={styles.metaValue}>{response.incidentCard.incidentType}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={styles.metaValue}>{response.incidentCard.status}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Resolution ETA</Text>
              <Text style={styles.metaValue}>{response.incidentCard.resolutionETA}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Resolution Group</Text>
              <Text style={styles.metaValue}>{response.incidentCard.resolutionGroup}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Reported</Text>
              <Text style={styles.metaValue}>{response.incidentCard.reportedAt}</Text>
            </View>
          </View>
        </View>
      )}

      {/* View status button */}
      {response.viewStatusHref && (
        <Pressable
          style={styles.viewStatusBtn}
          onPress={() => router.push(response.viewStatusHref! as any)}
          accessibilityRole="button"
        >
          <Text style={styles.viewStatusIcon}>📊</Text>
          <Text style={styles.viewStatusText}>View status</Text>
          <Text style={styles.viewStatusChevron}>›</Text>
        </Pressable>
      )}
    </View>
  );
}

/* ---------------- Animated thinking dots ---------------- */
function ThinkingDots() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.thinkingBubble}>
      <View style={styles.thinkingDots}>
        {dots.map((dot, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
                transform: [
                  { translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

/* =====================================================================
 * SCRIPTED SELF-HEALING DEMO FLOW  (100% static / deterministic)
 * ---------------------------------------------------------------------
 * No real LLM / ServiceNow / GCP calls — every message is hardcoded so
 * the demo runs identically every time. Driven entirely by quick-reply
 * chips. To later wire a real ServiceNow call, replace MOCK_INCIDENT
 * (and the q_notresolved step's meta) with the live incident payload.
 * ===================================================================== */

// Single source of truth for the mock incidents (swap with real ServiceNow calls later).
const MOCK_INCIDENT = {
  id: 'INC0092241',
  type: 'Unplanned Disruption',
  priority: 'P2 - High',
  category: 'Point of Sale / Payment',
  configurationItem: 'Store 1025 - Checkout Systems',
  assignmentGroup: 'Retail Store Support',
  status: 'New - Raised to Service Desk',
};

// Incident for the payment-terminal connectivity flow (Lanes 5-8).
const MOCK_INCIDENT_PAYMENT = {
  id: 'INC0092242',
  type: 'Unplanned Disruption',
  priority: 'P2 - High',
  category: 'Point of Sale / Payment',
  configurationItem: 'Store 1025 - Payment Terminals (Lanes 5-8)',
  assignmentGroup: 'Retail Store Support',
  status: 'New - Raised to Retail Store Support',
};

// One scripted step = the bot message(s) shown after the user taps this chip,
// plus the next chips to offer. Ordered & fully hardcoded.
type ScriptStep = {
  userLabel: string; // text shown as the user's bubble when the chip is tapped
  bot: BotResponse[]; // hardcoded bot message(s), shown in order (~700ms typing each)
  next: string[]; // ids of the next chips to show ([] = end of flow)
  resetTo?: string; // if set: clear the chat and auto-type this new question afterwards
};

const SELF_HEAL_SCRIPT: Record<string, ScriptStep> = {
  q_why: {
    userLabel: 'Why has POS Terminal 2 become unresponsive?',
    bot: [
      {
        icon: '🛒',
        title: 'POS Terminal 2 — Store 1025',
        tone: 'warning',
        intro:
          'I reviewed recent store technology signals for Store 1025. POS Terminal 2 appears to have become unresponsive due to:',
        bullets: ['Degraded POS device performance'],
        meta: [
          { label: 'Store', value: '1025' },
          { label: 'Device', value: 'POS Terminal 2' },
          { label: 'Signal Source', value: 'Store Tech Telemetry' },
        ],
      },
    ],
    next: ['q_whatdo'],
  },

  q_whatdo: {
    userLabel: 'What should I do?',
    bot: [
      {
        icon: '🛠️',
        title: 'Recommended Actions',
        tone: 'info',
        intro: 'Here’s what I recommend:',
        steps: ['Run self-heal on the affected POS device.'],
        footer: 'I can run this automatically once you approve.',
      },
    ],
    next: ['q_startrem'],
  },

  q_startrem: {
    userLabel: 'Can you start remediation?',
    bot: [
      {
        icon: '🤖',
        title: 'Remediation Available',
        tone: 'info',
        intro: 'Yes — I can take this approved action right now:',
        bullets: ['Initiate self-heal on the affected POS device'],
        footer: 'Type “Proceed” to start remediation.',
      },
    ],
    next: ['q_proceed'],
  },

  // Human-in-the-loop: "Remediation started" is ONLY shown after the user confirms "Proceed".
  q_proceed: {
    userLabel: 'Proceed.',
    bot: [
      {
        icon: '✅',
        title: 'Remediation Started',
        tone: 'success',
        intro: 'Done — remediation is underway:',
        bullets: ['Self-heal triggered on the affected POS device'],
      },
      {
        icon: '❓',
        title: 'Quick Check',
        tone: 'info',
        question: 'Is the checkout issue now resolved on your side?',
      },
    ],
    next: ['q_resolved', 'q_notresolved'],
  },

  // --- Resolution branch A: resolved -> positive close, then start the payment-terminal flow ---
  q_resolved: {
    userLabel: 'Yes, resolved',
    bot: [
      {
        icon: '🎉',
        title: 'Confirmation Received',
        tone: 'success',
        intro: `Thank you for your confirmation. I have created an incident record for this with Incident ID: ${MOCK_INCIDENT.id} for future reference.`,
      },
    ],
    next: [], // end of flow 1
    resetTo: 'Facing issue for payment terminal connectivity from lane 5 through 8',
  },

  // --- Resolution branch B: not resolved -> raise the (mock) incident ---
  q_notresolved: {
    userLabel: 'No, still facing issues',
    bot: [
      {
        icon: '🎫',
        title: 'Incident Raised to Service Desk',
        tone: 'warning',
        intro:
          "Thanks for letting me know. Since the issue persists after remediation, I've raised an incident with the Service Desk:",
        meta: [
          { label: 'Incident ID', value: MOCK_INCIDENT.id },
          { label: 'Type', value: MOCK_INCIDENT.type },
          { label: 'Priority', value: MOCK_INCIDENT.priority },
          { label: 'Category', value: MOCK_INCIDENT.category },
          { label: 'Configuration Item', value: MOCK_INCIDENT.configurationItem },
          { label: 'Assignment Group', value: MOCK_INCIDENT.assignmentGroup },
          { label: 'Status', value: MOCK_INCIDENT.status },
        ],
        footer:
          'The Retail Store Support team will follow up. You can track progress under this Incident ID.',
      },
    ],
    next: [], // end of flow
  },

  /* ===== FLOW 2: Payment terminal connectivity (Lanes 5-8) ===== */

  p_why: {
    userLabel: 'Facing issue for payment terminal connectivity from lane 5 through 8',
    bot: [
      {
        icon: '💳',
        title: 'Payment Terminal Connectivity — Lanes 5-8',
        tone: 'warning',
        intro:
          'Possible cause: the payment terminal connectivity for Lanes 5 through 8 has hung due to a dropped network session between the terminals and the payment gateway, which is preventing transactions from completing on those lanes.',
        meta: [
          { label: 'Affected', value: 'Lanes 5-8' },
          { label: 'Likely Cause', value: 'Dropped gateway session' },
          { label: 'Impact', value: 'Payments not completing' },
        ],
        footer:
          'Recommended action: restart the payment terminal connectivity to re-establish the session and bring the lanes back online.',
      },
    ],
    next: ['p_restart'],
  },

  p_restart: {
    userLabel: 'Restart the payment terminal connectivity',
    bot: [
      {
        icon: '🔄',
        title: 'Restart Initiated',
        tone: 'info',
        intro:
          'Started the restart of the payment terminal connectivity for Lanes 5 through 8. Re-establishing the session with the payment gateway now.',
      },
      {
        icon: '❓',
        title: 'Quick Check',
        tone: 'info',
        question: 'Does the issue still persist on Lanes 5-8?',
      },
    ],
    next: ['p_persist_yes', 'p_persist_no'],
  },

  // Persist -> requires physical intervention, raise incident
  p_persist_yes: {
    userLabel: 'Yes, it still persists',
    bot: [
      {
        icon: '🎫',
        title: 'Physical Intervention Required — Incident Raised',
        tone: 'warning',
        intro:
          'Ok — the restart has not worked, so this requires physical intervention. I have raised an incident for the retail store support team :',
        meta: [
          { label: 'Incident ID', value: MOCK_INCIDENT_PAYMENT.id },
          { label: 'Type', value: MOCK_INCIDENT_PAYMENT.type },
          { label: 'Priority', value: MOCK_INCIDENT_PAYMENT.priority },
          { label: 'Category', value: MOCK_INCIDENT_PAYMENT.category },
          { label: 'Configuration Item', value: MOCK_INCIDENT_PAYMENT.configurationItem },
          { label: 'Assignment Group', value: MOCK_INCIDENT_PAYMENT.assignmentGroup },
          { label: 'Status', value: MOCK_INCIDENT_PAYMENT.status },
        ],
        footer:
          'The Retail Store Support team will follow up on-site. You can track the incident status in the Notifications and Incidents pages.',
      },
    ],
    next: [], // end of flow
    resetTo: 'I am facing the printer paper jam issue',
  },

  // Not persisting -> resolved
  p_persist_no: {
    userLabel: "No, it's resolved",
    bot: [
      {
        icon: '🎉',
        title: 'Resolved',
        tone: 'success',
        intro:
          "Great — the restart brought Lanes 5 through 8 back online. I'll keep monitoring connectivity for the next business cycle.",
        footer: 'Have a great day! 👋',
      },
    ],
    next: [], // end of flow
    resetTo: 'I am facing the printer paper jam issue',
  },
};

// The typed turns are matched to their scripted step so the demo stays deterministic.
function getScriptedTypedStep(raw: string): string | null {
  const t = raw.toLowerCase();

  // Flow 2: payment terminal connectivity (checked first — 'restart' contains 'start')
  if (t.includes('restart')) return 'p_restart';
  if (
    t.includes('payment terminal') &&
    (t.includes('connectivity') || t.includes('lane') || t.includes('5'))
  )
    return 'p_why';

  // Flow 1: POS Terminal frozen -> self-heal
  if (/\bproceed\b/.test(t)) return 'q_proceed';
  if (t.includes('remediation') || (t.includes('start') && t.includes('remed'))) return 'q_startrem';
  if (t.includes('what') && (t.includes('should') || t.includes('do'))) return 'q_whatdo';
  if (t.includes('pos') && (t.includes('unresponsive') || t.includes('frozen') || t.includes('freeze') || t.includes('froze') || t.includes('terminal')))
    return 'q_why';
  if (
    (t.includes('checkout') || t.includes('check out')) &&
    /(slow|slower|slowness|delay|frozen|unresponsive)/.test(t)
  )
    return 'q_why';
  return null;
}

// The scripted flow now starts from TYPED input, so no starter chips are shown.
const SELF_HEAL_START_CHIPS: string[] = [];

// Step values that are shown as tappable quick-reply chips (the branch turns).
const CHIP_VALUES = new Set(['q_resolved', 'q_notresolved', 'p_persist_yes', 'p_persist_no']);
// Chips that represent a positive/good outcome (rendered green); the rest are red.
const POSITIVE_CHIPS = new Set(['q_resolved', 'p_persist_no']);

/* ---------------------------------------------------------------------
 * VIDEO-DEMO AUTO-TYPING
 * The four typed turns are auto-typed into the input box (char-by-char)
 * so a recording looks like a human typing — but nothing is sent until
 * the user clicks Send. After each turn's bot reply, the next question
 * auto-types itself. Sequence: Q1 -> Q2 -> Q3 -> "Proceed".
 * ------------------------------------------------------------------- */
const DEMO_FIRST_QUESTION = 'I am facing the printer paper jam issue';
// After a scripted step completes, which question to auto-type next.
const NEXT_DEMO_QUESTION: Record<string, string> = {
  q_why: 'What should I do?',
  q_whatdo: 'Can you start remediation?',
  q_startrem: 'Proceed',
  p_why: 'Restart the payment terminal connectivity',
};

const PRINTER_NEXT_AUTO_TYPE: Record<string, string> = {
  q1: 'Yes, ready',
  q2: 'Yes, removed it',
  q3: 'Yes, printed cleanly',
};

const POS_TERMINAL_QUESTION = 'Why has POS Terminal 2 become unresponsive?';

export default function DIYAssistantScreen() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  // Printer troubleshooting flow stage
  const [flowStage, setFlowStage] = useState<null | 'q1' | 'q2' | 'q3'>(null);
  // Scripted self-healing flow: currently-offered quick-reply chips ([] = hidden/ended)
  const [scriptChips, setScriptChips] = useState<string[]>(SELF_HEAL_START_CHIPS);
  // Video-demo auto-typing: the full question currently being auto-typed (null = none)
  const [pendingDemo, setPendingDemo] = useState<string | null>(null);
  // For subsequent flows: the question to auto-type when user clicks the button
  const [pendingReset, setPendingReset] = useState<string | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);
  const flatListRef = useRef<FlatList<Msg>>(null);

  // Auto-type a question into the input box, char-by-char (does NOT send it).
  const autoTypeInput = (text: string) => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setPendingDemo(text);
    setInput('');
    let i = 0;
    const typeNext = () => {
      i += 1;
      setInput(text.slice(0, i));
      if (i < text.length) {
        typingTimer.current = setTimeout(typeNext, 45);
      }
    };
    typingTimer.current = setTimeout(typeNext, 45);
  };

  // On initial load: auto-type the first question
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      autoTypeInput(DEMO_FIRST_QUESTION);
    }
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to the latest message/response whenever content changes.
  useEffect(() => {
    if (messages.length === 0) return;
    const id = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(id);
  }, [messages, typing]);

  // Create + register a new incident, then return the "raised" response card.
  const buildIncidentRaised = (): BotResponse => {
    const id = makeIncidentId();
    const incident: Incident = {
      id,
      title: 'Printer - Paper Jam Issue',
      subtitle: 'Receipt Printer Fault',
      service: 'Store Printer - Recurring Paper Jam',
      summary:
        'Recurring paper jam reported via the Virtual Assistant. Self-help steps and the Printer Setup Guide did not resolve the issue.',
      icon: '🖨️',
      severity: 'medium',
      status: 'open',
      badge: 'Open',
      reportedAt: new Date(),
      incidentType: 'Self-Service Raised',
      incidentStatusNew: 'New',
      resolutionETA: 'Awaiting assignment',
      resolutionGroup: 'Retail EUC Ops',
    };
    addIncident(incident);

    return {
      icon: '✅',
      title: 'Incident Raised Successfully',
      tone: 'success',
      intro: 'Your incident has been logged. Our support team will investigate shortly.',
      incidentCard: {
        id: incident.id,
        title: incident.title,
        incidentType: incident.incidentType,
        status: 'Open',
        severity: 'Medium',
        resolutionETA: incident.resolutionETA,
        resolutionGroup: incident.resolutionGroup,
        reportedAt: 'Just now',
      },
      viewStatusHref: '/incidents',
    };
  };

  const buildPrinterResolvedResponse = (): BotResponse => {
    const id = makeIncidentId();
    addIncident({
      id,
      title: 'Printer - Paper Jam Resolved',
      subtitle: 'Receipt Printer',
      service: 'Store Printer',
      summary: 'Paper jam cleared by store team via Virtual Assistant guided steps.',
      icon: '🖨️',
      severity: 'low',
      status: 'resolved',
      badge: 'Resolved',
      reportedAt: new Date(),
      incidentType: 'Self-Service Resolved',
      incidentStatusNew: 'Resolved',
      resolutionETA: 'Resolved',
      resolutionGroup: 'Retail EUC Ops',
    });
    return {
      icon: '🎉',
      title: 'Printer Issue Resolved!',
      tone: 'success',
      intro: `Great work! The printer is back up and running. Incident ID: ${id} created for reference.`,
      meta: [{ label: 'Incident ID', value: id }],
    };
  };

  // Decide the next bot response based on the current flow stage.
  const resolveConversation = (
    matchText: string
  ): { response: BotResponse; nextStage: null | 'q1' | 'q2' | 'q3' } => {
    const t = matchText.toLowerCase();
    const yes = isAffirmative(t);

    if (flowStage === 'q1') {
      // Step 1 answered: opened printer → move to paper removal
      return { response: printerStep2Response(), nextStage: 'q2' };
    }
    if (flowStage === 'q2') {
      return yes
        ? { response: printerStep3Response(), nextStage: 'q3' }
        : { response: buildIncidentRaised(), nextStage: null };
    }
    if (flowStage === 'q3') {
      // Step 3 answered: test print result
      return yes
        ? { response: buildPrinterResolvedResponse(), nextStage: null }
        : { response: buildIncidentRaised(), nextStage: null };
    }

    // No active flow — detect intent.
    if (isPrinterIntent(matchText)) {
      return { response: printerStep1Response(), nextStage: 'q1' };
    }
    return { response: getBotResponse(matchText), nextStage: null };
  };

  // Shared handler for typed input and quick-reply buttons.
  const processInput = (displayText: string, matchText: string) => {
    const prevStage = flowStage;
    const userMsg: Msg = { id: `u-${Date.now()}`, author: 'user', text: displayText, at: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    const { response, nextStage } = resolveConversation(matchText);
    setFlowStage(nextStage);

    const addBot = () =>
      setMessages((prev) => [
        ...prev,
        { id: `b-${Date.now()}`, author: 'bot', response, at: Date.now() },
      ]);

    // Greeting (and other instant responses) reply immediately — no thinking dots.
    if (response.instant) {
      addBot();
      return;
    }

    setTyping(true);
    setTimeout(() => {
      addBot();
      setTyping(false);
      if (nextStage && PRINTER_NEXT_AUTO_TYPE[nextStage]) {
        setTimeout(() => autoTypeInput(PRINTER_NEXT_AUTO_TYPE[nextStage]), 500);
      }
      if (prevStage === 'q3' && nextStage === null) {
        // Printer flow complete: set pending reset but don't auto-transition
        setTimeout(() => { 
          setPendingReset(POS_TERMINAL_QUESTION); 
        }, 500);
      }
    }, 1400); // thinking phase before the response appears
  };

  const send = () => {
    const trimmed = input.trim();

    // If a demo question was auto-typed, send the full intended question even if
    // the user clicks Send before typing finished. If the user typed their own
    // text instead, use that.
    const usePending =
      !!pendingDemo && (trimmed === '' || pendingDemo.startsWith(trimmed));
    const textToSend = usePending ? pendingDemo! : trimmed;
    if (!textToSend) return;

    // Stop any in-progress auto-typing and clear the box.
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setPendingDemo(null);
    setInput('');

    // Scripted self-healing flow: the first four turns are typed by the user.
    const scriptKey = getScriptedTypedStep(textToSend);
    if (scriptKey) {
      runScriptedStep(textToSend, scriptKey);
      return;
    }

    processInput(textToSend, textToSend);
  };

  const handleAction = (value: 'yes' | 'no', label: string) => {
    processInput(label, value);
  };

  // Append hardcoded bot messages one-by-one with a ~700ms typing delay before each.
  const appendBotSequence = (responses: BotResponse[], onDone?: () => void) => {
    let i = 0;
    const step = () => {
      if (i >= responses.length) {
        onDone?.();
        return;
      }
      setTyping(true);
      setTimeout(() => {
        const response = responses[i++];
        setMessages((prev) => [
          ...prev,
          { id: `b-${Date.now()}-${i}`, author: 'bot', response, at: Date.now() },
        ]);
        setTyping(false);
        step();
      }, 700); // small typing delay so it feels natural
    };
    step();
  };

  // Run a scripted step reached via TYPED input (shows the user's typed text, then bot msgs).
  const runScriptedStep = (displayText: string, key: string) => {
    const stepDef = SELF_HEAL_SCRIPT[key];
    if (!stepDef) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, author: 'user', text: displayText, at: Date.now() },
    ]);
    setScriptChips([]);
    appendBotSequence(stepDef.bot, () => {
      if (key === 'q_why') {
        // Navigate to POS page after response is shown — Terminal 2 shown yellow (issue detected)
        setTimeout(() => {
          router.push(('/devices/pos?highlight=pos-02&highlightStatus=yellow') as any);
          setTimeout(() => {
            router.back();
            setTimeout(() => {
              setScriptChips(stepDef.next.filter((v) => CHIP_VALUES.has(v)));
              const nq = NEXT_DEMO_QUESTION[key];
              if (nq) setTimeout(() => autoTypeInput(nq), 500);
            }, 400);
          }, 2500);
        }, 4000); // delay before showing device page
      } else if (key === 'q_proceed') {
        // Navigate to POS page after response is shown — Terminal 2 shown green (remediation resolved it)
        setTimeout(() => {
          router.push(('/devices/pos?highlight=pos-02&highlightStatus=green') as any);
          setTimeout(() => {
            router.back();
            setTimeout(() => {
              setScriptChips(stepDef.next.filter((v) => CHIP_VALUES.has(v)));
            }, 400);
          }, 2500);
        }, 800); // delay before showing device page
      } else {
        setScriptChips(stepDef.next.filter((v) => CHIP_VALUES.has(v)));
        const nextQuestion = NEXT_DEMO_QUESTION[key];
        if (nextQuestion) setTimeout(() => autoTypeInput(nextQuestion), 500);
      }
    });
  };

  // Advance the scripted flow when a quick-reply chip is tapped (the branch turns).
  const handleScriptChip = (value: string) => {
    const stepDef = SELF_HEAL_SCRIPT[value];
    if (!stepDef) return;

    // Show the user's tapped chip as a user bubble.
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, author: 'user', text: stepDef.userLabel, at: Date.now() },
    ]);

    // Hide chips while the bot "types", then reveal the next chips ([] = end of flow).
    setScriptChips([]);
    appendBotSequence(stepDef.bot, () => {
      setScriptChips(stepDef.next.filter((v) => CHIP_VALUES.has(v)));
      // If this step resets to a new conversation, only set the pending reset —
      // don't clear the chat automatically. User must click the + icon to continue.
      if (stepDef.resetTo) {
        setPendingReset(stepDef.resetTo);
        setFlowStage(null);
      }
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blue700} />

      {/* TCS header */}
      <TCSHeader showBack />

      {/* Compact header: centered title + top-right button */}
      <View style={[styles.heroRow, { justifyContent: 'center', position: 'relative' }]}>
        <Pressable
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => {
            if (messages.length === 0 && !pendingReset) {
              autoTypeInput(DEMO_FIRST_QUESTION);
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Virtual Assistant"
        >
          <Text style={styles.heroRowIcon}>🤖</Text>
          <Text style={styles.heroRowTitle}>Virtual Assistant</Text>
        </Pressable>
        <Pressable
          style={[styles.startBtn, { position: 'absolute', right: 16 }]}
          onPress={() => {
            if (pendingReset) {
              // Continue to pending next flow
              setMessages([]);
              setScriptChips([]);
              autoTypeInput(pendingReset);
              setPendingReset(null);
            } else if (messages.length > 0) {
              // Clear chat and start new flow
              setMessages([]);
              setScriptChips([]);
              setFlowStage(null);
              autoTypeInput(DEMO_FIRST_QUESTION);
            } else {
              // Start first flow
              autoTypeInput(DEMO_FIRST_QUESTION);
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Start new conversation"
        >
          <Text style={styles.startBtnIcon}>+</Text>
        </Pressable>
      </View>


      {/* Chat area */}
      <View style={styles.chat}>
        {messages.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 28 }}>💬</Text>
            <Text style={styles.emptyText}>Start a conversation</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) =>
              item.author === 'user' ? (
                <View style={[styles.bubble, styles.bubbleUser]}>
                  <Text style={styles.bubbleText}>{item.text}</Text>
                </View>
              ) : (
                <RichBotBubble response={item.response!} onAction={handleAction} />
              )
            }
            ListFooterComponent={typing ? <ThinkingDots /> : null}
          />
        )}
      </View>

      {/* Scripted self-healing quick-reply chips (only the final Yes/No branch) */}
      {scriptChips.length > 0 ? (
        <View style={styles.chipsRow}>
          {scriptChips.map((v) => {
            const isYes = POSITIVE_CHIPS.has(v);
            return (
              <Pressable
                key={v}
                style={[styles.chip, isYes ? styles.chipYes : styles.chipNo]}
                onPress={() => handleScriptChip(v)}
                accessibilityRole="button"
                accessibilityLabel={SELF_HEAL_SCRIPT[v].userLabel}
              >
                <Text style={[styles.chipText, isYes ? styles.chipTextYes : styles.chipTextNo]}>
                  {isYes ? '✅ ' : '❌ '}
                  {SELF_HEAL_SCRIPT[v].userLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {/* Input area */}
      <View style={styles.inputBar}>
        {messages.length === 0 ? (
          <Pressable style={styles.askBtn} onPress={send}>
            <Text style={styles.askBtnText}>How can I help you today?</Text>
          </Pressable>
        ) : null}

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Describe your issue"
            value={input}
            onChangeText={setInput}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={send}
          />
          <Pressable style={styles.sendBtn} onPress={send}>
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 10 },

  chat: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: COLORS.muted, marginTop: 6 },

  bubble: {
    maxWidth: '85%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: COLORS.bubbleUser },
  bubbleBot: { alignSelf: 'flex-start', backgroundColor: COLORS.bubbleBot },
  bubbleText: { color: COLORS.text, fontSize: 14 },

  /* ---- Rich bot bubble ---- */
  botBubble: {
    alignSelf: 'stretch',
    width: '92%',
    maxWidth: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    // shadow
    shadowColor: '#101828',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  botInfo: { borderLeftColor: '#2563EB' },
  botWarning: { borderLeftColor: '#F59E0B' },
  botSuccess: { borderLeftColor: '#10B981' },

  botHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  botHeaderIcon: { fontSize: 18, marginRight: 8 },
  botHeaderTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: COLORS.text },

  botIntro: { fontSize: 13.5, lineHeight: 20, color: '#374151' },

  metaWrap: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  metaLabel: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
  metaValue: { fontSize: 12.5, color: COLORS.text, fontWeight: '700', textAlign: 'right', flexShrink: 1, marginLeft: 8 },

  listWrap: { marginTop: 10, gap: 8 },
  listRow: { flexDirection: 'row', alignItems: 'flex-start' },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepNumText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  bulletDot: { color: '#2563EB', fontSize: 16, marginRight: 8, lineHeight: 20 },
  listText: { flex: 1, fontSize: 13.5, lineHeight: 20, color: '#374151' },

  footerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 10,
  },
  footerIcon: { fontSize: 14, marginRight: 8 },
  footerText: { flex: 1, fontSize: 12.5, lineHeight: 18, color: '#92400E' },

  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  linkIcon: { fontSize: 14, marginRight: 8 },
  linkText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#2563EB' },
  linkChevron: { fontSize: 16, fontWeight: '800', color: '#2563EB', marginLeft: 6 },

  /* ---- Follow-up question + quick replies ---- */
  botQuestion: {
    marginTop: 12,
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  actionBtn: {
    flexGrow: 1,
    minWidth: '46%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnPrimary: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  actionBtnGhost: { backgroundColor: '#FFFFFF', borderColor: '#D1D5DB' },
  actionBtnText: { fontSize: 13, fontWeight: '700' },
  actionBtnTextPrimary: { color: '#FFFFFF' },
  actionBtnTextGhost: { color: COLORS.text },

  /* ---- Raised incident card ---- */
  incidentCard: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  incidentCardHeader: { flexDirection: 'row', alignItems: 'center' },
  incidentCardHeaderIcon: { fontSize: 22, marginRight: 10 },
  incidentCardId: { fontSize: 12, fontWeight: '800', color: '#2563EB' },
  incidentCardTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginTop: 2 },
  incidentBadgesRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  incidentBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  incidentBadgeText: { fontSize: 11, fontWeight: '800' },

  /* ---- View status ---- */
  viewStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  viewStatusIcon: { fontSize: 14, marginRight: 8 },
  viewStatusText: { flex: 1, fontSize: 13, fontWeight: '800', color: '#047857' },
  viewStatusChevron: { fontSize: 16, fontWeight: '800', color: '#047857', marginLeft: 6 },

  typingRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingBottom: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#2563EB' },

  thinkingBubble: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    shadowColor: '#101828',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  thinkingDots: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 12 },

  /* ---- Scripted self-healing quick-reply chips ---- */
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  chip: {
    backgroundColor: '#EAF1FF',
    borderWidth: 1,
    borderColor: '#BFD3FF',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipText: { color: '#1D4ED8', fontSize: 13, fontWeight: '700' },
  chipYes: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  chipNo: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  chipTextYes: { color: '#047857' },
  chipTextNo: { color: '#B91C1C' },

  inputBar: { padding: 16 },
  askBtn: {
    backgroundColor: '#1F7AE0', borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center',
  },
  askBtnText: { color: '#FFFFFF', fontWeight: '700' },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  input: {
       flex: 1, backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E5E7EB', fontSize: 14, color: COLORS.text,
  },
  sendBtn: { backgroundColor: COLORS.blue700, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  sendText: { color: '#FFFFFF', fontWeight: '700' },
  hero: { alignItems: 'center', paddingVertical: 14 },
  heroIcon: { fontSize: 28 },
  heroTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 6 },
  heroSub: { fontSize: 12.5, color: COLORS.muted, marginTop: 2 },

  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
    paddingHorizontal: 16,
  },
  heroRowIcon: { fontSize: 20 },
  heroRowTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },

  startBtn: {
    backgroundColor: '#E8E8E8',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#101828',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  startBtnIcon: { fontSize: 18, color: '#666666', fontWeight: '500' },

})


