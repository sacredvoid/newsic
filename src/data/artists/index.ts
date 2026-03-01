import { artistProfiles } from './profiles'
import type { ArtistProfile, Genre } from '../../types'

export { artistProfiles }

export function getArtist(id: string): ArtistProfile | undefined {
  return artistProfiles.find((a) => a.id === id)
}

export function getArtistsByGenre(genre: Genre): ArtistProfile[] {
  return artistProfiles.filter((a) => a.genre === genre)
}
