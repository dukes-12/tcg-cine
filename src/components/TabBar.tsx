import { NavLink } from 'react-router-dom';
import { useStore } from '../state/store';
import { CollectionIcon, DupesIcon, FriendsIcon, OpenIcon, ProfileIcon, ShopIcon, TradeIcon } from './icons';

const TABS = [
  { to: '/collection', label: 'Collection', Icon: CollectionIcon },
  { to: '/shop', label: 'Boutique', Icon: ShopIcon },
  { to: '/open', label: 'Ouvrir', Icon: OpenIcon },
  { to: '/dupes', label: 'Doublons', Icon: DupesIcon },
  { to: '/trades', label: 'Échanges', Icon: TradeIcon },
  { to: '/friends', label: 'Amis', Icon: FriendsIcon },
  { to: '/profile', label: 'Profil', Icon: ProfileIcon },
];

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="tab-badge" aria-label={`${count} notification${count > 1 ? 's' : ''}`}>
      {count > 9 ? '9+' : count}
    </span>
  );
}

export default function TabBar() {
  // Pastilles visibles sans entrer dans l'onglet, comme MailboxButton dans
  // Profil (même compteur, deux endroits pour le voir) : messages non lus
  // sur Profil, propositions d'échange entrantes en attente sur Échanges.
  const mailboxUnread = useStore((s) => s.mailboxUnread);
  const tradesUnread = useStore((s) => s.tradesUnread);
  const badges: Partial<Record<string, number>> = { '/profile': mailboxUnread, '/trades': tradesUnread };

  return (
    <nav className="tab-bar" aria-label="Navigation principale">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `tab-btn${isActive ? ' is-active' : ''}`}
        >
          <span className="tab-icon">
            <Icon />
            <Badge count={badges[to] ?? 0} />
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
