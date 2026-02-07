'use client';

export default function TestVideoPage() {
  return (
    <div className="p-8 bg-black min-h-screen">
      <h1 className="text-2xl text-white mb-6">Video Test Page</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl text-white mb-2">Pine Ridge Fire Video</h2>
          <video 
            controls 
            className="w-full max-w-2xl"
            src="/videos/pine-ridge-fire.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <p className="text-white mt-2">Path: /videos/pine-ridge-fire.mp4</p>
        </div>

        <div>
          <h2 className="text-xl text-white mb-2">Redwood Valley Fire Video</h2>
          <video 
            controls 
            className="w-full max-w-2xl"
            src="/videos/redwood-valley-fire.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <p className="text-white mt-2">Path: /videos/redwood-valley-fire.mp4</p>
        </div>

        <div>
          <h2 className="text-xl text-white mb-2">Direct Link Tests</h2>
          <div className="space-y-2">
            <a 
              href="/videos/pine-ridge-fire.mp4" 
              target="_blank"
              className="block text-blue-400 hover:underline"
            >
              Open Pine Ridge Fire video in new tab
            </a>
            <a 
              href="/videos/redwood-valley-fire.mp4" 
              target="_blank"
              className="block text-blue-400 hover:underline"
            >
              Open Redwood Valley Fire video in new tab
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

