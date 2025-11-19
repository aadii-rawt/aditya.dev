import Profile from './Components/Profile'
import Intro from './Components/Intro'
import Project from './Components/Project'
import Experience from './Components/Experience'
import Skills from './Components/Skills'
import Github from './Components/Github'
import QuoteCard from './Components/QuoteCard'

function App() {
  return (
      <div className='bg-[#151312] text-white w-full min-h-screen'>
        <div className='max-w-[1150px] mx-auto py-24 flex flex-col md:flex-row items-center  md:items-start gap-20 relative '>
          <div className='lg:sticky lg:left-0 lg:top-24 mx-5'>
            <Profile />
          </div>
          <div className='flex-1 px-5'>
            <Intro />
            <Github />
            <Project />
            <Experience />
            <Skills />
            <QuoteCard />
          </div>
        </div>
      </div>
  )
}

export default App
