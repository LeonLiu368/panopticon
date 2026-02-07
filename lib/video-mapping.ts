// Video mapping for fire incidents
export interface FireVideo {
  name: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  description?: string;
}

// Map fire names to their corresponding video files
export const FIRE_VIDEOS: Record<string, FireVideo> = {
  'Pine Ridge Fire': {
    name: 'Pine Ridge Fire',
    videoUrl: '/videos/pine-ridge-fire.mp4',
    thumbnailUrl: '/videos/pine-ridge-fire-thumb.jpg',
    description: 'Live footage from Pine Ridge Fire operations'
  },
  'Redwood Valley Fire': {
    name: 'Redwood Valley Fire', 
    videoUrl: '/videos/redwood-valley-fire.mp4',
    thumbnailUrl: '/videos/redwood-valley-fire-thumb.jpg',
    description: 'Live footage from Redwood Valley Fire operations'
  }
};

// Get video info for a fire by name
export function getFireVideo(fireName: string | null): FireVideo | null {
  console.log('[getFireVideo] Looking for video for fire:', fireName);
  console.log('[getFireVideo] Available fires:', Object.keys(FIRE_VIDEOS));
  
  if (!fireName) {
    console.log('[getFireVideo] No fire name provided');
    return null;
  }
  
  // Try exact match first
  if (FIRE_VIDEOS[fireName]) {
    console.log('[getFireVideo] Found exact match:', FIRE_VIDEOS[fireName]);
    return FIRE_VIDEOS[fireName];
  }
  
  // Try partial match for variations in naming
  const normalizedName = fireName.toLowerCase().trim();
  console.log('[getFireVideo] Trying partial match with normalized name:', normalizedName);
  
  for (const [key, video] of Object.entries(FIRE_VIDEOS)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      console.log('[getFireVideo] Found partial match:', key, video);
      return video;
    }
  }
  
  console.log('[getFireVideo] No match found for:', fireName);
  return null;
}

// Check if video is available
export function isVideoAvailable(fireName: string | null): boolean {
  const video = getFireVideo(fireName);
  return video?.videoUrl ? true : false;
}
