'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUpdateProfile } from '@/hooks/use-profile'
import type { Profile } from '@/types/api'

interface ProfileEditFormProps {
  profile: Profile
  onClose: () => void
}

const AVATAR_COLORS = [
  { name: 'Jade', hex: '#3E7A55' },
  { name: 'Rust', hex: '#C75B3A' },
  { name: 'Amber', hex: '#C9A84C' },
  { name: 'Moss', hex: '#7B8F6A' },
  { name: 'Slate', hex: '#6B7B8D' },
  { name: 'Plum', hex: '#8B5E83' },
  { name: 'Teal', hex: '#4A8C8C' },
  { name: 'Coral', hex: '#D4806B' },
]

const UpdateSchema = z.object({
  bio: z.string().max(280, 'Bio must be 280 characters or less').optional(),
  githubUrl: z.union([z.string().url('Must be a valid URL'), z.literal('')]).optional(),
  linkedinUrl: z.union([z.string().url('Must be a valid URL'), z.literal('')]).optional(),
  websiteUrl: z.union([z.string().url('Must be a valid URL'), z.literal('')]).optional(),
})

export function ProfileEditForm({ profile, onClose }: ProfileEditFormProps) {
  const [bio, setBio] = useState(profile.bio ?? '')
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl ?? '')
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(profile.websiteUrl ?? '')
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor ?? '#3E7A55')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { mutate, isPending } = useUpdateProfile()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const parsed = UpdateSchema.safeParse({ bio, githubUrl, linkedinUrl, websiteUrl })
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.errors.forEach((err) => {
        const field = err.path[0]
        if (field) fieldErrors[String(field)] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    mutate(
      {
        bio: bio || null,
        avatarColor,
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null,
        websiteUrl: websiteUrl || null,
      },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {/* Avatar color picker */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
          Avatar Color
        </label>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                title={c.name}
                onClick={() => setAvatarColor(c.hex)}
                className="w-8 h-8 rounded-full border-2 transition-all duration-150 cursor-pointer"
                style={{
                  background: c.hex,
                  borderColor: avatarColor === c.hex ? 'var(--zen-text-primary, #E8E4DF)' : 'transparent',
                  transform: avatarColor === c.hex ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-[family-name:var(--font-display)] font-bold text-white text-lg transition-all duration-150"
            style={{
              background: avatarColor,
              boxShadow: `0 0 24px ${avatarColor}44`,
            }}
          >
            {profile.username[0].toUpperCase()}
          </div>
        </div>
      </div>

      <div className="relative">
        <Input
          as="textarea"
          label="Bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, 280))}
          placeholder="Tell us about yourself..."
          error={errors.bio}
        />
        <span className="absolute bottom-2 right-3 text-[10px] text-[var(--color-text-tertiary)]">
          {bio.length}/280
        </span>
      </div>

      <Input
        label="GitHub URL"
        type="url"
        value={githubUrl}
        onChange={(e) => setGithubUrl(e.target.value)}
        placeholder="https://github.com/username"
        error={errors.githubUrl}
      />

      <Input
        label="LinkedIn URL"
        type="url"
        value={linkedinUrl}
        onChange={(e) => setLinkedinUrl(e.target.value)}
        placeholder="https://linkedin.com/in/username"
        error={errors.linkedinUrl}
      />

      <Input
        label="Website URL"
        type="url"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
        placeholder="https://yoursite.com"
        error={errors.websiteUrl}
      />

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" size="sm" loading={isPending}>
          Save Profile
        </Button>
      </div>
    </form>
  )
}
