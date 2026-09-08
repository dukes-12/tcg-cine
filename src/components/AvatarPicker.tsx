import { useRef, useState } from 'react';
import { AVATARS } from '../data/avatars';
import { readAndCompressPhoto } from '../lib/photo';
import { useStore } from '../state/store';
import Avatar from './Avatar';

/** Profil → Photo de profil : soit une vraie photo choisie dans la galerie
 *  de l'appareil (compressée en local, voir lib/photo.ts), soit un avatar
 *  préréglé — tous débloqués d'office, contrairement aux dos de carte
 *  (CardBackPicker), donc pas de prix à afficher. La photo est prioritaire
 *  sur l'avatar quand les deux sont enregistrés (voir Avatar.tsx) ; choisir
 *  un préréglage retire donc la photo pour que le tuile cliquée devienne
 *  bien celle qui s'affiche. */
export default function AvatarPicker() {
  const avatar = useStore((s) => s.avatar);
  const avatarPhoto = useStore((s) => s.avatarPhoto);
  const setAvatar = useStore((s) => s.setAvatar);
  const setAvatarPhoto = useStore((s) => s.setAvatarPhoto);
  const say = useStore((s) => s.say);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pickPreset = (key: (typeof AVATARS)[number]['key']) => {
    setAvatar(key);
    if (avatarPhoto) setAvatarPhoto(null);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permet de re-choisir le même fichier ensuite
    if (!file) return;
    setBusy(true);
    try {
      const dataUri = await readAndCompressPhoto(file);
      setAvatarPhoto(dataUri);
    } catch (err) {
      say(err instanceof Error ? err.message : 'Photo illisible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: '22px 18px 0' }}>
      <div className="section-label" style={{ marginBottom: 11 }}>Photo de profil</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />

        {avatarPhoto ? (
          <div style={{ position: 'relative' }}>
            <button type="button" className="avatar-choice is-selected" onClick={() => fileRef.current?.click()} title="Changer la photo">
              <Avatar avatar={avatar} photo={avatarPhoto} size={52} boxShadow="none" />
            </button>
            <button
              className="pressable"
              type="button"
              onClick={() => setAvatarPhoto(null)}
              title="Retirer la photo"
              aria-label="Retirer la photo"
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: 0,
                cursor: 'pointer',
                background: 'var(--color-neutral-900)',
                color: 'var(--color-text)',
                fontSize: 11,
                lineHeight: '20px',
                textAlign: 'center',
                padding: 0,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            className="avatar-choice avatar-choice--upload"
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            title="Choisir une photo"
            aria-label="Ajouter une photo"
            aria-busy={busy}
          >
            {busy ? '…' : <><span aria-hidden="true">＋</span><span className="sr-only">Ajouter une photo</span></>}
          </button>
        )}

        {AVATARS.map((a) => (
          <button
            key={a.key}
            className={`avatar-choice${!avatarPhoto && avatar === a.key ? ' is-selected' : ''}`}
            type="button"
            onClick={() => pickPreset(a.key)}
            title={a.name}
            aria-label={`Choisir l’avatar ${a.name}`}
          >
            <Avatar avatar={a.key} size={52} boxShadow="none" />
          </button>
        ))}
      </div>
    </div>
  );
}
