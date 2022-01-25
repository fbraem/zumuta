const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { createMarkdownRenderer } = require('vitepress')

const md = createMarkdownRenderer(process.cwd())

module.exports = {
    watch: '../cycling/*.md',
    load(asFeed = false) {
        const cyclingDir = path.resolve(__dirname, '../cycling')
        return fs
            .readdirSync(cyclingDir)
            .map((file) => getCycling(file, cyclingDir, asFeed))
            .sort((a, b) => b.year - a.year)
    }
}

const cache = new Map()

function getCycling(file, cyclingDir, asFeed = false) {
    const fullPath = path.join(cyclingDir, file)
    const timestamp = fs.statSync(fullPath).mtimeMs

    const cached = cache.get(fullPath)
    if (cached && timestamp === cached.timestamp) {
        return cached.cycling
    }

    const src = fs.readFileSync(fullPath, 'utf-8')
    const { data, excerpt} = matter(src, { excerpt: true })
    const cycling = {
        title: data.title,
        href: `/cycling/${file.replace(/\.md$/, '.html')}`,
        year: data.year,
        excerpt: md.render(excerpt)
    }
    if (asFeed) {
        // only attach these when building the RSS feed to avoid bloating the
        // client bundle size
        cycling.data = data
    }

    cache.set(fullPath, {
        timestamp,
        cycling
    })
    return cycling
}
