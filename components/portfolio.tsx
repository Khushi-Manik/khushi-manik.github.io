"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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
  type: "single" | "gallery"
  action: "popup" | "link"
  url?: string
  images: string[]
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
    profileImage: string
    about: string
    email: string
    phone?: string
    location?: string
  }
  skills: string[] // Now just an array of skill IDs
  links: LinkButton[]
  buttonStyles: Record<string, { className: string }>
  portfolio: PortfolioItem[]
  experience?: Experience[]
  education?: Education[]
  accomplishments?: Accomplishment[]
}

const config = portfolioConfig as PortfolioConfig

export default function Portfolio() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const getSkillData = (skillId: string): SkillTag | null => {
    const skillData = skillsDatabase[skillId as keyof typeof skillsDatabase]
    if (!skillData) return null

    let backgroundColor = skillData.color
    let textColor = "#000000"

    if (skillData.color === "default") {
      backgroundColor = isDarkMode ? "#ffffff" : "#000000"
      textColor = isDarkMode ? "#000000" : "#ffffff"
    } else {
      // For custom colors, determine best contrast text color
      textColor = getContrastColor(skillData.color)
    }

    return {
      id: skillId,
      name: skillData.name,
      icon: skillData.icon,
      color: backgroundColor,
      textColor: textColor,
    }
  }

  const getContrastColor = (hexColor: string): string => {
    // Convert hex to RGB
    const r = Number.parseInt(hexColor.slice(1, 3), 16)
    const g = Number.parseInt(hexColor.slice(3, 5), 16)
    const b = Number.parseInt(hexColor.slice(5, 7), 16)

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? "#000000" : "#ffffff"
  }

  const handleLinkClick = (url: string) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer")
    } else {
      window.open(url, "_blank")
    }
  }

  const handlePortfolioClick = (item: PortfolioItem) => {
    if (item.action === "link" && item.url) {
      handleLinkClick(item.url)
    } else if (item.action === "popup") {
      setSelectedPortfolio(item)
      setCurrentImageIndex(0)
    }
  }

  const closePopup = () => {
    setSelectedPortfolio(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedPortfolio) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedPortfolio.images.length)
    }
  }

  const prevImage = () => {
    if (selectedPortfolio) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedPortfolio.images.length) % selectedPortfolio.images.length)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
      <Button
        onClick={() => setIsDarkMode(!isDarkMode)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90 transition-all duration-300"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </Button>

      <div className="py-12 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance drop-shadow-2xl dark:text-shadow-white light:text-shadow-black">
              {config.personal.name}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty drop-shadow-lg dark:text-shadow-white light:text-shadow-black">
              {/* Removed title from personal config */}
            </p>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/30 to-accent/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 dark:opacity-50 dark:group-hover:opacity-100" />
                <Image
                  src={config.personal.profileImage || "/placeholder.svg"}
                  alt={`${config.personal.name} profile picture`}
                  width={200}
                  height={200}
                  className="relative rounded-2xl transition-all duration-300 group-hover:scale-105 border-2 border-primary/20 dark:shadow-white-glow light:shadow-black-deep"
                  priority
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Skill Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {config.skills.map((skillId) => {
                const skill = getSkillData(skillId)
                if (!skill) return null

                return (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="px-3 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm dark:shadow-white-glow light:shadow-black-deep"
                    style={{
                      backgroundColor: skill.color,
                      color: skill.textColor,
                    }}
                  >
                    <Image
                      src={skill.icon || "/placeholder.svg"}
                      alt={skill.name}
                      width={16}
                      height={16}
                      className="mr-1.5"
                    />
                    {skill.name}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* About Section */}
          <Card className="mb-12 backdrop-blur-sm bg-card/80 border-primary/20 dark:shadow-white-glow-lg light:shadow-black-deep-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center dark:text-shadow-white light:text-shadow-black">
                About Me
              </h2>
              <p className="text-lg text-muted-foreground text-center leading-relaxed text-pretty mb-8 dark:text-shadow-white light:text-shadow-black">
                {config.personal.about}
              </p>
              <div className="flex justify-center items-center gap-4 mb-8 text-muted-foreground">
                {/* Removed location from personal config */}
                <span>✉️ {config.personal.email}</span>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {config.links.map((link) => {
                  const buttonStyle = config.buttonStyles[link.style] || config.buttonStyles.default
                  return (
                    <Button
                      key={link.id}
                      onClick={() => handleLinkClick(link.url)}
                      size="sm"
                      className={cn(
                        "h-auto py-2 px-4 flex items-center gap-2 transition-all duration-300 hover:scale-105 dark:shadow-white-glow dark:hover:shadow-white-glow-hover light:shadow-black-deep light:hover:shadow-black-deep-hover",
                        buttonStyle.className,
                      )}
                    >
                      <span className="text-sm">{link.icon}</span>
                      <span className="text-sm font-medium">{link.label}</span>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Experience Section */}
          {config.experience && config.experience.length > 0 && (
            <Card className="mb-12 backdrop-blur-sm bg-card/80 border-primary/20 dark:shadow-white-glow-lg light:shadow-black-deep-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-8 text-center dark:text-shadow-white light:text-shadow-black">
                  Experience
                </h2>
                <div className="space-y-6">
                  {config.experience.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-primary pl-6 py-2">
                      <h3 className="text-lg font-semibold text-foreground dark:text-shadow-white light:text-shadow-black">
                        {exp.title}
                      </h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-3">{exp.period}</p>
                      <p className="text-muted-foreground text-pretty dark:text-shadow-white light:text-shadow-black">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Portfolio/Projects Section */}
          <Card className="mb-12 backdrop-blur-sm bg-card/80 border-primary/20 dark:shadow-white-glow-lg light:shadow-black-deep-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center dark:text-shadow-white light:text-shadow-black">
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.portfolio.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group cursor-pointer relative p-6 rounded-xl transition-all duration-300 hover:scale-105 dark:shadow-white-glow dark:hover:shadow-white-glow-hover light:shadow-black-deep light:hover:shadow-black-deep-hover border border-primary/20 hover:border-primary/50 hover:bg-card/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground dark:text-shadow-white light:text-shadow-black mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground dark:text-shadow-white light:text-shadow-black">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-2xl group-hover:scale-110 transition-transform">🔗</span>
                    </div>
                    <p className="text-sm text-foreground dark:text-shadow-white light:text-shadow-black text-pretty">
                      {item.description}
                    </p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education Section */}
          {config.education && config.education.length > 0 && (
            <Card className="mb-12 backdrop-blur-sm bg-card/80 border-primary/20 dark:shadow-white-glow-lg light:shadow-black-deep-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-8 text-center dark:text-shadow-white light:text-shadow-black">
                  Education
                </h2>
                <div className="space-y-6">
                  {config.education.map((edu) => (
                    <div key={edu.id} className="border-l-4 border-accent pl-6 py-2">
                      <h3 className="text-lg font-semibold text-foreground dark:text-shadow-white light:text-shadow-black">
                        {edu.degree}
                      </h3>
                      <p className="text-accent font-medium">{edu.school}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {edu.location} • {edu.period}
                      </p>
                      {edu.cgpa && <p className="text-sm text-foreground">CGPA: {edu.cgpa}</p>}
                      {edu.percentage && <p className="text-sm text-foreground">Score: {edu.percentage}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accomplishments Section */}
          {config.accomplishments && config.accomplishments.length > 0 && (
            <Card className="mb-12 backdrop-blur-sm bg-card/80 border-primary/20 dark:shadow-white-glow-lg light:shadow-black-deep-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-8 text-center dark:text-shadow-white light:text-shadow-black">
                  Awards & Achievements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {config.accomplishments.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-6 rounded-lg border border-primary/20 dark:shadow-white-glow light:shadow-black-deep transition-all duration-300 hover:border-primary/50"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-2xl">🏆</span>
                        <div>
                          <h3 className="font-semibold text-foreground dark:text-shadow-white light:text-shadow-black mb-1">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2 dark:text-shadow-white light:text-shadow-black">
                            {achievement.event}
                          </p>
                          <p className="text-xs text-primary font-medium">{achievement.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {selectedPortfolio && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Button
              onClick={closePopup}
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              ✕
            </Button>

            <div className="relative">
              <Image
                src={selectedPortfolio.images[currentImageIndex] || "/placeholder.svg"}
                alt={selectedPortfolio.title}
                width={800}
                height={600}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />

              {selectedPortfolio.images.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  >
                    ←
                  </Button>
                  <Button
                    onClick={nextImage}
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
                  >
                    →
                  </Button>
                </>
              )}
            </div>

            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-bold mb-2">{selectedPortfolio.title}</h3>
              <p className="text-sm opacity-80">{new Date(selectedPortfolio.timestamp).toLocaleDateString()}</p>
              {selectedPortfolio.images.length > 1 && (
                <p className="text-xs mt-2 opacity-60">
                  {currentImageIndex + 1} of {selectedPortfolio.images.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-primary/20 py-4 dark:shadow-white-glow light:shadow-black-deep">
        <div className="text-center">
          <p className="text-muted-foreground text-sm dark:text-shadow-white light:text-shadow-black">
            © 2026 Khushi Manik. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
