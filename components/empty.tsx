import Image from 'next/image'

interface EmptyProps {
  label: string
}

const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <div className="relative h-52 w-52">
        <Image
          alt="Empty"
          fill
          src={'/jarvis-idle.png'}
          className="opacity-5 animate-pulse"
        />
      </div>
      <p className="text-muted-foreground text-sm text-center">{label}</p>
    </div>
  )
}

export default Empty
