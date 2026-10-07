
// app/incidents/data.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
export type IncidentStatus = 'open' | 'pending' | 'resolved';
export type IncidentSeverity = 'high' | 'medium' | 'low';

export type Incident = {
  id: string;
  title: string;
  subtitle:string;            // e.g., "ISP - Primary Link"
  service?: string;         // e.g., "AT&T SDWAN Link"
  shortDescription?: string;
  summary?: string;
  icon?: React.ReactNode;           
  severity: IncidentSeverity;
  status: IncidentStatus;
  badge?: string;           // optional context (e.g., "Pending Site Visit")
  reportedAt: Date; 
  incidentType: string;
  incidentStatusNew: string;
  resolutionETA: string;
  resolutionGroup: string;

};

/** Small helper so the icon usage stays terse/consistent */

const CommunityIcon = ({
  name,
  size = 32,
  color = '#f9cc18', // default yellow per your request
  paddingTop = 28,
}: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name']; // ✅ use typeof
  size?: number;
  color?: string;
  paddingTop?: number;
}) => (
  <View style={{ paddingTop }}>
    <MaterialCommunityIcons name={name} size={size} color={color} />
  </View>
);


/** Use community icons instead of direct icons/emojis */

const IncidentIcons = {
  primaryLink: <CommunityIcon name="web" color='#fe3131' />, 
  register:    <CommunityIcon name="note-edit" />,        
  pos:         <CommunityIcon name="typewriter" />,              
  accessPoint:  <CommunityIcon name="wifi"/>,    
};


const now = Date.now();

// --- exactly 4 incidents ---

export const incidents: Incident[] = [
  // ✅ ISP PRIMARY LINK
  {
    id: 'INC00001234',
    title: 'ISP - Primary Link',
    subtitle: 'Retail SDWAN ATTLink Status',
    service: 'AT&T SDWAN Linkdown',
    summary:
      'Primary link for the store is down, store network is up backup link. Working with the Telco Provider for the link restoration.',
    icon: IncidentIcons.primaryLink,
    severity: 'high',
    status: 'pending',
    badge: 'Pending Site Visit',
    reportedAt: new Date(now - 1.4 * 60 * 60 * 1000),

    incidentType: 'Network Alert Based',
    incidentStatusNew: 'Ongoing',
    resolutionETA: 'Awaiting update from ISP',
    resolutionGroup: 'Network Ops',
  },

  // ✅ REGISTER
  {
    id: 'INC00001236',
    title: 'Register 04 - System Offline',
    subtitle: 'Register Application Error',
    service: 'Register 04 - Checkout 4',
    summary:
      'Register 04 is offline. Trying to reach store to check the device status.',
    icon: IncidentIcons.register,
    severity: 'medium',
    status: 'open',
    badge: 'Open',
    reportedAt: new Date(now - 12 * 60 * 60 * 1000),

    incidentType: 'Device Alert Based',
    incidentStatusNew: 'Ongoing',
    resolutionETA: 'Awaiting update from store',
    resolutionGroup: 'Retail EUC Ops',
  },

  // ✅ POS TERMINAL
  {
    id: 'INC00001235',
    title: 'POS Terminal 03 - System Offline',
    subtitle: 'POS Application Error',
    service: 'POS Terminal 03 - Checkout 3 Hardware Issue',
    summary:
      'POS terminal hardware failure. Hardware needs to be replaced by Field Tech.',
    icon: IncidentIcons.pos,
    severity: 'medium',
    status: 'pending',
    badge: 'Pending',
    reportedAt: new Date(now - 6 * 60 * 60 * 1000),

    incidentType: 'Device Alert Based',
    incidentStatusNew: 'Ongoing',
    resolutionETA: 'Today 12PM CET',
    resolutionGroup: 'Retail EUC Ops',
  },

  // ✅ ACCESS POINT
  {
    id: 'INC00001237',
    title: 'Wireless - Access Point A004',
    subtitle: 'Network accesspoint unavailable',
    service: 'Access Point - Sales Floor is down',
    summary:
      'Access point A004 is offline. Remote troubleshooting indicates issue with AP itself. New AP hardware has been ordered, once delivered, tech will be assigned for doing the replacement.',
    icon: IncidentIcons.accessPoint,
    severity: 'medium',
    status: 'open',
    badge: 'Open',
    reportedAt: new Date(now - 2.2 * 60 * 60 * 1000),

    incidentType: 'Network Alert Based',
    incidentStatusNew: 'Ongoing',
    resolutionETA: 'Today 2PM CET',
    resolutionGroup: 'Network Ops',
  },
];


export function getIncidentById(id: string) {
  return incidents.find(i => i.id === id);
}

// ---- Create a new incident (used by the Virtual Assistant self-service flow) ----
let newIncidentSeq = 1250;
export function makeIncidentId() {
  const id = `INC${String(newIncidentSeq).padStart(8, '0')}`;
  newIncidentSeq += 1;
  return id;
}

export function addIncident(incident: Incident) {
  // newest first
  incidents.unshift(incident);
  return incident;
}


export function getIncidentsSortedDesc() {
  // Clone then sort to avoid mutating original
  return [...incidents].sort(
    (a, b) => b.reportedAt.getTime() - a.reportedAt.getTime()
  );
}

export function getOtherThree(id: string) {
  // Return the other 3 incidents (for "Related incidents")
  return incidents.filter(i => i.id !== id);
}

// UI meta helpers
export function statusMeta(s: IncidentStatus) {
  switch (s) {
    case 'open':
      return { bg: '#FDE68A', text: '#92400E', label: 'Open' };       // amber
    case 'pending':
      return { bg: '#DBEAFE', text: '#1E40AF', label: 'Pending' };    // blue
    case 'resolved':
      return { bg: '#D1FAE5', text: '#065F46', label: 'Resolved' };   // green
    default:
      return { bg: '#E5E7EB', text: '#374151', label: 'Unknown' };
  }
}

export function severityMeta(sev: IncidentSeverity) {
  switch (sev) {
    case 'high':
      return { bg: '#fe3131', text: '#ffffff', label: 'High' };       // red-light
    case 'medium':
      return { bg: '#ffde58', text: '#ffffff', label: 'Medium' };     // amber
    default:
      return { bg: '#E5E7EB', text: '#374151', label: '—' };
  }
}

export function relativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
}
