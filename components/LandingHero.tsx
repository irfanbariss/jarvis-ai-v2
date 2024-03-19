'use client'

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import TypewriterComponent from 'typewriter-effect'
import { Button } from './ui/button'

export const LandingHero = () => {
  const { isSignedIn } = useAuth()

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5">
        <h1>Your Friendly Neighborhood AI</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-700">
          <TypewriterComponent
            options={{
              strings: [
                'Assistant.',
                'Coder.',
                'Musician.',
                'Photo Generator.',
                'Video Generator.',
              ],
              autoStart: true,
              loop: true,
              delay: 75,
            }}
          />
        </div>
      </div>
      <div className='"text-sm md:text-xl font-light text-zinc-400'>
        Create content, write code, or just chat with JARVIS.
      </div>
      <div>
        <Link href={isSignedIn ? '/dashboard' : '/sign-up'}>
          <Button
            variant="secondary"
            className="md:text-large p-4 md:p-6 rounded-full font-semibold text-white bg-gradient-to-r from-orange-500 to-purple-700"
          >
            Start Generating
          </Button>
        </Link>
      </div>
    </div>
  )
}
