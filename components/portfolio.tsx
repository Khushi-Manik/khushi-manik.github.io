"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Trophy,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import portfolioConfig from "@/config/portfolio.json"
import skillsDatabase from "@/config/skills-database.json"

interface SkillTag {
  id: string
  name: string
  icon: string
  color: string
  textColor: string
}

interface LinkButton {
  id: string
  label: string
  url: string
  style: string
  icon: string
}

interface PortfolioItem {
  id: string
  title: string
  timestamp: string
  description: string
  impact?: string
  stack?: string[]
  highlights?: string[]
  type: "single" | "gallery"
  action: "popup" | "link"
  url?: string
  images?: string[]
}

interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string
}

interface Education {
  id: string
  degree: string
  school: string
  location: string
  period: string
  cgpa?: string
  percentage?: string
}

interface Accomplishment {
  id: string
  title: string
  event: string
  year: string
}

interface PortfolioConfig {
  personal: {
    name: string
    role?: string
    headline?: string
    intro?: string
    availability?: string
    profileImage: string
    about: string
    email: string
    phone?: string
    location?: string
  }
  skills: string[]
  links: LinkButton[]
  buttonStyles: Record<string, { className: string }>
  portfolio: PortfolioItem[]
  experience?: Experience[]
  education?: Education[]
  accomplishments?: Accomplishment[]
}

const config = portfolioConfig as PortfolioConfig

const formatPortfolioDate = (timestamp: string) => {
  const [year, month, day] = timestamp.split("-").map(Number)

  if (![year, month, day].every(Number.isFinite)) {
    return timestamp
  }

  return `${day}/${month}/${year}`
}

const getPortfolioImages = (item: PortfolioItem) => item.images ?? []

const sectionLinks = [
  { href: "#work", label: "Work" },
  { href: "#story", label: "Story" },
  { href: "#credentials", label: "Credentials" },
  { href: "#contact", label: "Contact" },
]

export default function Portfolio() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const selectedPortfolioImages = selectedPortfolio ? getPortfolioImages(selectedPortfolio) : []

  useEffect(() => {
    document.documentElement.classList.remove("dark")
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedPortfolio ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedPortfolio])

  const getSkillData = (skillId: string): SkillTag | null => {
    const skillData = skillsDatabase[skillId as keyof typeof skillsDatabase]

    if (!skillData) return null

    return {
      id: skillId,
      name: skillData.name,
      icon: skillData.icon,
      color: skillData.color === "default" ? "rgba(243, 239, 230, 0.08)" : skillData.color,
      textColor: skillData.color === "default" ? "#f3efe6" : getContrastColor(skillData.color),
    }
  }

  const getContrastColor = (hexColor: string) => {
    const r = Number.parseInt(hexColor.slice(1, 3), 16)
    const g = Number.parseInt(hexColor.slice(3, 5), 16)
    const b = Number.parseInt(hexColor.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.5 ? "#08101b" : "#f8f2e7"
  }

  const handleLinkClick = (url: string) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer")
      return
    }

    window.open(url, "_blank")
  }

  const handlePortfolioClick = (item: PortfolioItem) => {
    if (item.action === "popup") {
      setSelectedPortfolio(item)
      setCurrentImageIndex(0)
      return
    }

    if (item.url) {
      handleLinkClick(item.url)
    }
  }

  const nextImage = () => {
    if (selectedPortfolioImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedPortfolioImages.length)
    }
  }

  const prevImage = () => {
    if (selectedPortfolioImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedPortfolioImages.length) % selectedPortfolioImages.length)
    }
  }

  const skills = config.skills.map(getSkillData).filter((skill): skill is SkillTag => skill !== null)
  const featuredProjects = config.portfolio.slice(0, 4)
  return (
    <div className="relative overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0 ink-grid opacity-25" />
      <div className="pointer-events-none absolute left-0 top-0 h-[28rem] w-[28rem] rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-[24rem] w-[24rem] rounded-full bg-primary/15 blur-3xl" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08101b]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="display-type text-xl font-semibold text-[#fff5e8]">
            {config.personal.name}
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {sectionLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>
          <Button
            asChild
            className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-[#f6b679]"
          >
            <a href="#contact">Start a conversation</a>
          </Button>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto max-w-7xl px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-8">
              <div className="space-y-5">
                <h1 className="display-type max-w-4xl text-4xl leading-[0.98] text-balance text-[#fff5e8] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                  {config.personal.headline ?? config.personal.about}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  {config.personal.intro ?? config.personal.about}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-[#f6b679]"
                >
                  <a href="#work">
                    View featured work
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 px-6 text-foreground hover:bg-white/10"
                >
                  <a href={`mailto:${config.personal.email}`}>Email me</a>
                </Button>
              </div>
            </div>

            <div className="section-frame relative">
              <div className="glass-panel overflow-hidden rounded-[2rem] p-6 md:p-8">
                <div className="flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <p className="eyebrow">Positioning</p>
                    <div>
                      <p className="text-lg font-medium text-[#fff5e8]">
                        {config.personal.role ?? "AI and Data Science Student"}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {config.personal.availability ?? "Open to internships and product-focused opportunities."}
                      </p>
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">{config.personal.about}</p>
                  </div>

                  <div className="grid gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-3">
                      <MapPin className="size-4 text-secondary" />
                      <span>{config.personal.location}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-3">
                      <Mail className="size-4 text-secondary" />
                      <span>{config.personal.email}</span>
                    </div>
                    {config.personal.phone && (
                      <div className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-3">
                        <Phone className="size-4 text-secondary" />
                        <span>{config.personal.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="glass-panel rounded-[2rem] p-7 md:p-9">
              <p className="eyebrow">Why this portfolio reads differently</p>
              <h2 className="display-type mt-4 text-4xl text-[#fff5e8] md:text-5xl">
                I like work that proves itself in outcomes, not adjectives.
              </h2>
            </div>
            <div className="glass-panel rounded-[2rem] p-7 md:p-9">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">What I bring</p>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    Machine learning thinking, product empathy, and enough frontend/backend fluency to turn a good
                    research idea into a usable experience.
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">What matters to me</p>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    Clear user value, measurable improvement, and interfaces that make technical systems feel calm,
                    useful, and trustworthy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Featured work</p>
              <h2 className="display-type mt-3 text-4xl text-[#fff5e8] md:text-6xl">Projects with signal.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              Each project here solves a practical problem and shows how I think about intelligence, systems, and user
              experience together.
            </p>
          </div>

          <div className="space-y-8">
            {featuredProjects.map((item, index) => (
              <article
                key={item.id}
                className="section-frame glass-panel overflow-hidden rounded-[2rem] p-6 md:p-8"
              >
                <div className="grid gap-8 lg:grid-cols-2">
                  <div
                    className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0e1830] p-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,166,90,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(125,211,199,0.18),transparent_35%)]" />
                    <div className="relative flex h-full min-h-[18rem] flex-col justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-secondary">Project {index + 1}</p>
                        <h3 className="display-type mt-4 text-4xl text-[#fff5e8]">{item.title}</h3>
                      </div>
                      <div className="max-w-sm">
                        <p className="text-sm leading-7 text-muted-foreground">
                          {item.impact ?? item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`flex flex-col justify-between gap-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{formatPortfolioDate(item.timestamp)}</span>
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                        <span>{item.type === "gallery" ? "Interactive walkthrough" : "Code and product build"}</span>
                      </div>
                      <p className="text-base leading-8 text-muted-foreground">{item.description}</p>
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="grid gap-3">
                          {item.highlights.map((highlight) => (
                            <div
                              key={highlight}
                              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                            >
                              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                              <p className="text-sm leading-7 text-muted-foreground">{highlight}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-4">
                      {item.stack && item.stack.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.stack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#fff5e8]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handlePortfolioClick(item)}
                        className="story-link w-fit"
                      >
                        {item.action === "popup" ? "Open project details" : "View live project or code"}
                        <ArrowUpRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="credentials" className="mx-auto max-w-7xl px-5 pb-20 md:px-8 md:pb-28">
          <div className="mb-10">
            <p className="eyebrow">Credentials</p>
            <h2 className="display-type mt-3 text-4xl text-[#fff5e8] md:text-6xl">Depth behind the visuals.</h2>
          </div>

          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-8">
              <section className="glass-panel rounded-[2rem] p-7 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <BriefcaseBusiness className="size-5 text-primary" />
                  <h3 className="text-lg font-medium text-[#fff5e8]">Experience</h3>
                </div>
                <div className="space-y-6">
                  {config.experience?.map((exp) => (
                    <div key={exp.id} className="border-l border-white/15 pl-5">
                      <p className="text-sm uppercase tracking-[0.24em] text-secondary">{exp.period}</p>
                      <h4 className="mt-3 text-xl font-medium text-[#fff5e8]">{exp.title}</h4>
                      <p className="mt-1 text-sm text-primary">{exp.company}</p>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-panel rounded-[2rem] p-7 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Trophy className="size-5 text-primary" />
                  <h3 className="text-lg font-medium text-[#fff5e8]">Recognition</h3>
                </div>
                <div className="space-y-4">
                  {config.accomplishments?.map((achievement) => (
                    <div key={achievement.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-secondary">{achievement.year}</p>
                      <h4 className="mt-3 text-lg font-medium text-[#fff5e8]">{achievement.title}</h4>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{achievement.event}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="glass-panel rounded-[2rem] p-7 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <GraduationCap className="size-5 text-primary" />
                  <h3 className="text-lg font-medium text-[#fff5e8]">Education</h3>
                </div>
                <div className="space-y-5">
                  {config.education?.map((edu) => (
                    <div key={edu.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-[#fff5e8]">{edu.degree}</h4>
                          <p className="mt-1 text-sm text-primary">{edu.school}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {edu.location}, {edu.period}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {edu.cgpa && <span>CGPA {edu.cgpa}</span>}
                        {edu.percentage && <span>Score {edu.percentage}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="glass-panel rounded-[2rem] p-7 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <Sparkles className="size-5 text-primary" />
                  <h3 className="text-lg font-medium text-[#fff5e8]">Toolkit</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-2"
                      style={{ backgroundColor: skill.color, color: skill.textColor }}
                    >
                      <img src={skill.icon || "/placeholder.svg"} alt={skill.name} width={18} height={18} />
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
          <div className="section-frame glass-panel rounded-[2.25rem] px-6 py-10 md:px-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <p className="eyebrow">Contact</p>
                <h2 className="display-type mt-4 max-w-3xl text-4xl text-[#fff5e8] md:text-6xl">
                  If you need someone who can think in models and ship in products, let&apos;s talk.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                  I am looking for work where research, engineering, and product thinking meet. The best fit is a team
                  that values clarity, iteration, and measurable user impact.
                </p>
              </div>

              <div className="space-y-4">
                {config.links.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleLinkClick(link.url)}
                    className="flex w-full items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:border-primary/40 hover:bg-white/10"
                  >
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{link.label}</p>
                      <p className="mt-2 text-lg font-medium text-[#fff5e8]">{link.url.replace("mailto:", "")}</p>
                    </div>
                    <ArrowUpRight className="size-5 text-primary" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 text-sm text-muted-foreground md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>{config.personal.name} portfolio</p>
          <p>Built to feel editorial, human, and technically grounded.</p>
        </div>
      </footer>

      {selectedPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07101ccc] p-4 backdrop-blur-md">
          <div className="glass-panel relative w-full max-w-5xl rounded-[2rem] p-5 md:p-7">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setSelectedPortfolio(null)}
              className="absolute right-5 top-5 border-white/10 bg-white/5 text-foreground hover:bg-white/10"
            >
              <X className="size-4" />
            </Button>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0e1830]">
                <Image
                  src={selectedPortfolioImages[currentImageIndex] || "/placeholder.svg"}
                  alt={selectedPortfolio.title}
                  width={1200}
                  height={900}
                  className="h-auto w-full object-cover"
                />

                {selectedPortfolioImages.length > 1 && (
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={prevImage}
                      className="border-white/10 bg-[#07101ccc] text-foreground hover:bg-[#15213dcc]"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={nextImage}
                      className="border-white/10 bg-[#07101ccc] text-foreground hover:bg-[#15213dcc]"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between gap-6 pt-6 lg:pt-2">
                <div>
                  <p className="eyebrow">Project detail</p>
                  <h3 className="display-type mt-4 text-4xl text-[#fff5e8]">{selectedPortfolio.title}</h3>
                  <p className="mt-4 text-sm text-muted-foreground">{formatPortfolioDate(selectedPortfolio.timestamp)}</p>
                  <p className="mt-5 text-base leading-8 text-muted-foreground">{selectedPortfolio.description}</p>
                </div>

                <div className="space-y-4">
                  {selectedPortfolio.highlights?.map((highlight) => (
                    <div key={highlight} className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-sm leading-7 text-muted-foreground">{highlight}</p>
                    </div>
                  ))}

                  {selectedPortfolio.url && (
                    <button
                      type="button"
                      onClick={() => handleLinkClick(selectedPortfolio.url!)}
                      className="story-link"
                    >
                      Open project link
                      <ArrowUpRight className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
