# Fire Video Files

Place your fire video files in this directory with the following naming convention:

## Required Files:
- `pine-ridge-fire.mp4` - Video footage for Pine Ridge Fire
- `redwood-valley-fire.mp4` - Video footage for Redwood Valley Fire

## Optional Files:
- `pine-ridge-fire-thumb.jpg` - Thumbnail for Pine Ridge Fire (optional)
- `redwood-valley-fire-thumb.jpg` - Thumbnail for Redwood Valley Fire (optional)

## Supported Formats:
- Video: MP4, WebM, OGG
- Thumbnails: JPG, PNG, WebP

## File Size Recommendations:
- Video files: Keep under 50MB for optimal loading
- Thumbnails: Keep under 1MB

## How it works:
The system will automatically detect these files and display them in the fire popups on the map. If a video file is not found, it will show "Video Currently Unavailable" instead.

## Adding New Fires:
To add video support for new fires, update the `FIRE_VIDEOS` mapping in `lib/video-mapping.ts` and add the corresponding video file here.
