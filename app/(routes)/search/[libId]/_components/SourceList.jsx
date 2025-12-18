
import React from 'react';


function SourceList({ searchResult, loadingSearch }) {


  return (

    <div className="flex flex-wrap gap-4 mt-4">
      {!searchResult && <div>
        <div className='w-full h-5 mt-2 bg-gray-100 animate-pulse rounded-md'></div>
        <div className='w-1/2 h-5 mt-2 bg-gray-100 animate-pulse rounded-md'></div>
        <div className='w-[70%] h-5 mt-2 bg-gray-100 animate-pulse rounded-md'></div>

      </div>}
      {searchResult.map((item, index) => {
        let displayLink = '';
        try {
          displayLink = item.url ? new URL(item.url).hostname.replace('www.', '') : '';
        } catch {
          displayLink = '';
        }
        const snippet = item.snippet || '';
        const thumbnail = item.thumbnail || '';


        return (

          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 bg-white border border-gray-100 rounded-xl w-[220px] p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group h-full"
          >
            <div className="flex items-center gap-2 mb-1">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Thumbnail"
                  className="w-5 h-5 object-contain rounded-sm"
                />
              ) : (
                <div className="w-5 h-5 bg-gray-100 rounded-sm flex-shrink-0" />
              )}
              <div className="text-xs text-gray-500 font-medium truncate w-full group-hover:text-blue-500 transition-colors">{displayLink}</div>
            </div>

            <div className="text-sm text-gray-800 font-semibold leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
              {item.title || displayLink}
            </div>

            <div className="text-xs text-gray-500 leading-relaxed line-clamp-3 mt-1">
              {snippet}
            </div>
          </a>
        );
      })}
      {loadingSearch && <div className='flex flex-wrap gap-4'>
        {[1, 2, 3, 4].map((item, index) => (
          <div className='w-[220px] h-[140px] rounded-xl bg-gray-50 border border-gray-100 animate-pulse' key={index}>
          </div>
        ))}
      </div>}

    </div>
  );
}

export default SourceList;
