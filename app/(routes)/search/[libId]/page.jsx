'use client'
import { supabase } from '@/app/Supabase';
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Header from './_components/Header';
import DisplayResult from './_components/DisplayResult';

const SearchQueryResult = () => {
  const { libId } = useParams();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  // Initialize with optimistic data if available
  const [searchInputRecord, setSearchInputRecord] = useState(
    q ? { searchInput: q, created_at: new Date().toISOString() } : null
  );

  useEffect(() => {
    GetSearchQueryRecord();
  }, [])

  const GetSearchQueryRecord = async () => {
    // Polling mechanism to handle race condition from optimistic navigation
    let attempts = 0;
    const maxAttempts = 10;

    const fetchRecord = async () => {
      let { data: Library, error } = await supabase
        .from('Library')
        .select('*,Chats(*)')
        .eq('libId', libId);

      if (Library && Library.length > 0) {
        console.log(Library[0]);
        setSearchInputRecord(Library[0]);
        return true;
      }
      return false;
    };

    // Try immediately
    if (await fetchRecord()) return;

    // Poll if not found
    const interval = setInterval(async () => {
      attempts++;
      const found = await fetchRecord();
      if (found || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 1000);
  }
  return (
    <div>
      <Header searchInputRecord={searchInputRecord} />
      <div className='px-10 md:px-20 lg:px-36 xl:px-56 mt-20'>
        {/* Only render DisplayResult when we have the real record (with ID) to avoid errors */}
        {searchInputRecord?.id ? (
          <DisplayResult searchInputRecord={searchInputRecord} onUpdate={GetSearchQueryRecord} />
        ) : (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchQueryResult
