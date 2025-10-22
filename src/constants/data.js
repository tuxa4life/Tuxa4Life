export const experience = [
    {
        label: 'Front-end Development',
        since: 2019,
    },
    {
        label: 'Back-end Development',
        since: 2021,
    },
    {
        label: 'Database Management',
        since: 2023,
    },
    {
        label: 'Desktop App Development',
        since: 2024,
    },
]

export const skills = {
    languages: [
        { svg: 'javascript', label: 'JavaScript' },
        { svg: 'java', label: 'Java' },
        { svg: 'kotlin', label: 'Kotlin' },
        { svg: 'python', label: 'Python' },
        { svg: 'csharp', label: 'C#' },
        { svg: 'ocaml', label: 'OCaml' },
        { svg: 'sql', label: 'SQL' },
        { svg: 'html', label: 'HTML' },
        { svg: 'css', label: 'CSS' },
    ],

    libraries_and_frameworks: [
        { svg: 'react', label: 'React' },
        { svg: 'node', label: 'NodeJs' },
        { svg: 'threejs', label: 'Three.js' },
        { svg: 'express', label: 'Express' },
        { svg: 'electron', label: 'Electron.js' },
        { svg: 'cheerio', label: 'Cheerio' },
        { svg: 'sass', label: 'Sass' },
        { svg: 'tailwind', label: 'Tailwind CSS' },
        { svg: 'bootstrap', label: 'Bootstrap' },
        { svg: 'socketio', label: 'Socket.IO' },
        { svg: 'semantic', label: 'Semantic-UI' },
    ],

    services: [
        { svg: 'supabase', label: 'Supabase' },
        { svg: 'firebase', label: 'Firebase' },
        { svg: 'postgre', label: 'PostgreSQL' },
        { svg: 'git', label: 'Git' },
    ],

    tools: [
        { svg: 'figma', label: 'Figma' },
        { svg: 'adobePhotoshop', label: 'Adobe Photoshop' },
        { svg: 'premierePro', label: 'Adobe Premiere Pro' },
        { svg: 'canva', label: 'Canva' },
        { svg: 'unity', label: 'Unity' },
        { svg: 'blender', label: 'Blender' },
        { svg: 'maya', label: 'Maya' },
    ],
}

export const projects = [
    {
        image: 'osm',
        title: 'OpenStreetMap 3D Renderer',
        description: 'A React app that fetches geographic data from OpenStreetMap (OSM) and generates a 3D map using Three.js based on node information. You can also export the 3D map as a GLTF file.',
        tools: [
            {
                icon: 'react',
                label: 'React',
            },
            {
                icon: 'node',
                label: 'NodeJs',
            },
            {
                icon: 'threejs',
                label: 'Three.js',
            },
            {
                icon: 'css',
                label: 'CSS',
            },
        ],
        sourceUrl: 'https://github.com/tuxa4life/OSM-City-Builder',
        demoUrl: 'https://osm.tuxa.ge',
    },
    {
        image: 'bura',
        title: 'Bura',
        description: 'A real-time multiplayer Bura card game built with React.js on the frontend and Socket.IO on the backend.',
        tools: [
            {
                icon: 'react',
                label: 'React',
            },
            {
                icon: 'node',
                label: 'NodeJs',
            },
            {
                icon: 'socketio',
                label: 'Socket.IO',
            },
            {
                icon: 'css',
                label: 'CSS',
            },
        ],
        sourceUrl: 'https://github.com/tuxa4life/Bura',
        demoUrl: 'https://bura.tuxa.ge',
    },
    {
        image: 'kiudrop',
        title: 'KIU Drop',
        description: 'KIU Drop is a rental platform for KIU students to lend and borrow stuff like tech, tools, or household items.',
        tools: [
            {
                icon: 'react',
                label: 'React',
            },
            {
                icon: 'node',
                label: 'NodeJs',
            },
            {
                icon: 'socketio',
                label: 'Socket.IO',
            },
            {
                icon: 'supabase',
                label: 'Supabase',
            },
            {
                icon: 'semantic',
                label: 'Semantic-UI',
            },
        ],
        sourceUrl: 'https://github.com/tuxa4life/KIU-Drop',
        demoUrl: 'https://kiudrop.tuxa.ge',
    },
    {
        image: 'rasadrodis',
        title: 'რა? სად? როდის?',
        description: 'A real-time online trivia game inspired by the classic Georgian show "რა? სად? როდის?".',
        tools: [
            {
                icon: 'react',
                label: 'React',
            },
            {
                icon: 'node',
                label: 'NodeJs',
            },
            {
                icon: 'socketio',
                label: 'Socket.IO',
            },
            {
                icon: 'cheerio',
                label: 'Cheerio',
            },
            {
                icon: 'semantic',
                label: 'Semantic-UI',
            },
        ],
        sourceUrl: 'https://github.com/tuxa4life/KIU-Drop',
        demoUrl: 'https://kiudrop.tuxa.ge',
    }
]

const icons = {}
const images = {}

const t = require.context('../assets', false, /\.png$/)
t.keys().forEach((item) => {
    const name = item.replace('./', '').replace('.png', '')
    images[name] = t(item)
})

const r = require.context('../svgs/skills', false, /\.svg$/)
r.keys().forEach((item) => {
    const name = item.replace('./', '').replace('.svg', '')
    icons[name] = r(item)
})

export { icons, images }
