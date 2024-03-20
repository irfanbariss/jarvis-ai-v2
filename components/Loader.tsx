import Image from 'next/image'

const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center">
      <div className="w-20 h-20 relative animate-bounce">
        <Image alt="logo" fill src="/jarvis-thinking.png" />
      </div>
      <p className="text-sm text-muted-foreground">JARVIS is thinking...</p>
    </div>
  )
}

export default Loader
