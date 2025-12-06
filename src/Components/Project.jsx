import React from 'react'
import { GoArrowUpRight } from 'react-icons/go'
function Project() {

    const projectList = [
        {
            title: "FUMA",
            languages: "MERN",
            image: './fuma.png',
            url: "https://fuma.dotdazzle.in/"
        },
        {
            title: "Remail",
            languages: "MERN",
            image: './remail.png',
            url: "https://remail.dotdazzle.in/"
        },
        {
            title: "Github Wrapped",
            languages: "MERN",
            image: './githubwrapped.png',
            url: "https://git-wrapped.dotdazzle.in/"
        },
        {
            title: "DoraUI",
            languages: "MERN",
            image: './doraui.png',
            url: "https://doraui.dotdazzle.in/"
        },
        {
            title: "Chartr",
            languages: "React Native • React.js • Firebase • Tailwind CSS",
            image: '/chartr-logo.png',
            url: "https://chartr-apk.netlify.app"
        },
        {
            title: "Bill Flow",
            languages: "MERN",
            image: 'https://i.pinimg.com/736x/56/72/0e/56720e8a30f283dab3eac92fecc89e72.jpg',
            url: "https://billsflow.netlify.app/"
        },
        {
            title: "Google Keep ",
            languages: "React • Firebase • CSS • MUI",
            image: 'https://i.pinimg.com/736x/57/9d/e5/579de5242325d1154f0b47977b4cbbec.jpg',
            url: "https://google-keep-ar4.netlify.app"
        },
        {
            title: "Binary Trading",
            languages: "React • TradingView Chart",
            image: 'https://i.pinimg.com/736x/72/60/27/72602765fd8b28df1c127e655bfed488.jpg',
            url: "https://binary-trade.netlify.app/"
        },
        // {
        //     title: "Pinterest",
        //     languages: "React • Firebase • Tailwind CSS",
        //     image: 'https://i.pinimg.com/736x/07/99/9f/07999f9eb4034c65a4a962fbdd666522.jpg',
        //     url: "https://pinterest-ar.netlify.app/",
        //     isProcess: true,
        // },
        // {
        //     title: "URL Shortener",
        //     languages: "React • Firebase • Tailwind CSS",
        //     image: 'https://www.shutterstock.com/image-vector/url-shortener-male-user-compresses-600nw-2213913815.jpg',
        //     url: "https://url-shortener-ar.netlify.app/"
        // },
    ]
    return (
        <div className='pb-10'>
            <div>
                <h1 className='text-5xl text-center md:text-left lg:text-8xl font-extrabold uppercase font-poppins'>Recent <span className='text-[#353334]'>Projects</span></h1>
            </div>

            <div className='my-5'>
                {projectList.map((p, i) => (
                    <a href={p?.url} target='_blank' key={i} className='hover:bg-[#1C1A19]  cursor-pointer flex items-start justify-between p-5 rounded-2xl'>
                        <div className='flex items-center gap-5' >
                            {/* <img src="" alt="" /> */}
                            <div className='w-20 h-20 md:w-28 md:h-28 bg-white rounded-xl overflow-hidden flex items-center justify-center object-cover'>
                                <img src={p?.image} alt="" className=' object bg-contain' />
                            </div>
                            <div>
                                <h1 className='font-semibold text-2xl md:text-3xl font-poppins'>{p?.title}</h1>
                            </div>
                        </div>
                        <button className='text-2xl text-[#F46C38] hidden sm:block'><GoArrowUpRight /></button>
                    </a>))}
            </div>
        </div>
    )
}

export default Project

