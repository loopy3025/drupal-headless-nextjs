"use client"

import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import { NextDrupal } from "next-drupal"
const drupal = new NextDrupal(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL)

console.log('NEXT_PUBLIC_DRUPAL_BASE_URL');
console.log(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL);

import { useEffect, useState } from 'react';

export default async function Home() {
  const localUri = "http://drupal-headless.docksal.ny.gov";
  const endpoints = [
    localUri + '/api/test',
  ];

  try {
    // Fetch data from all endpoints concurrently
    const responses = await Promise.all(endpoints.map(endpoint => fetch(endpoint)));

    // Process the responses (e.g., parse JSON)
    const data = await Promise.all(responses.map(async response => {
      // Check if the response is successful and has a valid JSON body
      if (!response.ok) {
        console.error(`Error fetching data from ${response.url}: ${response.statusText}`);
        return null; // Return null or an empty array for failed requests
      }
      return await response.json();
    }));

    // Filter out null or undefined responses and flatten the arrays
    const combinedData = data.filter(item => item !== null && Array.isArray(item)).flat();

    return (
      <div>
        <h1>Test Drupal -&gt; NextJS</h1>
        <ul>
          {combinedData.map((item, index) => (
            <li key={index}>
              {/* Ensure item.title and item.view_node exist */}
              {item && typeof item.title === 'string' && item.view_node ? (
                <Link 
                  href={localUri + item.view_node}
                  target="_blank"
                >
                  {item.title}
                </Link>
              ) : (
                // Handle cases where data structure might be unexpected
                <span>Invalid data structure or missing data</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );

  } catch (error) {
    console.error('Error fetching data:', error);
    // You can render an error message or a fallback UI here
    return <div>Error loading data. Please try again later.</div>;
  }
}
