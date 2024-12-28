"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { HeroSection } from "@/components/sections/hero-section";
import { UtilityCard } from "@/components/sections/utility-card";
import { ChangelogSection } from "@/components/sections/changelog-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { ScreenshotViewer } from "@/components/sections/screenshot-viewer";
import { AcknowledgementSection } from "@/components/sections/acknowledgement-section";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NewsFeed, NewsProvider } from "@/components/sections/news-feed";

interface DownloadCounts {
  PSTInsight: number;
  ConnectX: number;
  ChecksumCheck: number;
  EventSleuth: number;
  BitBurn: number;
}

type UtilityName = keyof DownloadCounts;

const isValidUtility = (utility: string): utility is UtilityName => {
  return ['PSTInsight', 'ConnectX', 'ChecksumCheck', 'EventSleuth', 'BitBurn'].includes(utility);
};

export default function Home() {
  const { toast } = useToast();
  const [downloadCounts, setDownloadCounts] = useState<DownloadCounts>({
    PSTInsight: 0,
    ConnectX: 0,
    ChecksumCheck: 0,
    EventSleuth: 0,
    BitBurn: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const utilities: UtilityName[] = [
          "EventSleuth",
          "PSTInsight",
          "ConnectX",
          "ChecksumCheck",
          "BitBurn"
        ];

        const counts = await Promise.all(
          utilities.map(async (utility) => {
            try {
              const response = await fetch(`/api/downloads?utility=${utility}`);
              const data = await response.json();
              
              // Handle KV environment variable errors gracefully
              if (data.error?.includes('@vercel/kv')) {
                console.warn(`KV storage not configured for ${utility}, using fallback count`);
                return { utility, count: 0 };
              }

              if (!response.ok) {
                throw new Error(data.details || 'Failed to fetch download count');
              }

              // Ensure count is a valid number
              const count = typeof data.count === 'number' ? data.count : 0;
              return { utility, count };
            } catch (error) {
              console.error(`Error processing ${utility}:`, error);
              return { utility, count: 0 };
            }
          })
        );

        const newCounts = counts.reduce(
          (acc, { utility, count }) => ({
            ...acc,
            [utility]: count,
          }),
          {} as DownloadCounts
        );

        setDownloadCounts(prev => ({
          ...prev,
          ...newCounts
        }));

      } catch (error) {
        console.error("Failed to fetch download counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const handleDownload = async (utility: UtilityName) => {
    if (!isValidUtility(utility)) {
      console.error(`Invalid utility name: ${utility}`);
      return;
    }

    try {
      const response = await fetch("/api/downloads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ utility }),
      });

      const data = await response.json();

      // Handle KV environment variable errors gracefully
      if (data.error?.includes('@vercel/kv')) {
        toast({
          title: "Download Started",
          description: `${utility} download has started. Download tracking temporarily unavailable.`,
          duration: 5000,
        });
        return Promise.resolve();
      }

      if (!response.ok) {
        throw new Error(data.details || "Failed to increment download count");
      }

      if (data.success) {
        const newCount = typeof data.count === 'number' ? data.count : 0;
        setDownloadCounts((prev) => ({
          ...prev,
          [utility]: newCount,
        }));

        toast({
          title: "Download Started",
          description: `${utility} download has started. Thank you for using my tools!`,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Failed to increment download count:", error);
      toast({
        title: "Download Started",
        description: "Download tracking failed, but your download should start shortly.",
        duration: 5000,
      });
    }
  };

  const ChecksumCheckScreenshots = [
    { src: "/images/checksumcheck/main-dark.png", alt: "main-dark" },
    { src: "/images/checksumcheck/checksum_results-dark.png", alt: "results-dark" },
    { src: "/images/checksumcheck/main-light.png", alt: "main-light" },
    { src: "/images/checksumcheck/checksum_results-light.png", alt: "results-light" },
  ];

  const pstInsightScreenshots = [
    { src: "/images/pstinsight/main.png", alt: "main" },
    { src: "/images/pstinsight/search.png", alt: "results" },
  ];

  const ConnectXScreenshots = [
    { src: "/images/connectx/main.png", alt: "main" },
    { src: "/images/connectx/manage_hosts.png", alt: "manage" },
    { src: "/images/connectx/rdp_creds.png", alt: "rdp" },
  ];

  const eventSleuthScreenshots = [
    { src: "/images/eventsleuth/main.png", alt: "main" },
    { src: "/images/eventsleuth/search.png", alt: "results" },
    { src: "/images/eventsleuth/themes.png", alt: "themes" },
  ];

  const discussionReasons = [
    "Submit bugs you have found with the utilities",
    "Get support from me directly",
    "Share ideas for new features or improvements",
    "Engage with other users",
  ];

  const bitBurnScreenshots = [
    { src: "/images/bitburn/main-dark.png", alt: "main-dark" },
    { src: "/images/bitburn/main-light.png", alt: "main-light" },
  ];

  return (
    <>
      <div className="min-h-screen">
        {/* Main Content */}
        <div className="space-y-20 pb-8">
          <HeroSection />

          {/* BitBurn Section */}
          <section id="bitburn" className="utility-section">
            <UtilityCard
              title="BitBurn"
              version="1.0.0"
              description="Secure Data Erasure Tool"
              gradient="from-blue-500 to-orange-500"
              downloadCount={downloadCounts.BitBurn}
              sha256="c86903f9e9bb2e3cccebafca1e51c61e8b4680ea5a68675e7a5c1158980f781a"
              downloadLink="/static/downloads/BitBurn/BitBurn.exe"
              onDownload={() => handleDownload("BitBurn")}
            >
              <p className="text-muted-foreground text-center">
                A powerful and user-friendly data erasure tool built with Tauri and React. BitBurn securely overwrites files and folders
                using military-grade deletion methods, ensuring your sensitive data cannot be recovered.
              </p>

              <ScreenshotViewer
                screenshots={bitBurnScreenshots}
                utility="BitBurn"
              />

              <FeaturesSection
                title="Key Features"
                features={[
                  "Multiple secure deletion algorithms including DoD 5220.22-M",
                  "Progress tracking with detailed statistics",
                  "Drag and drop file/folder support",
                  "System tray integration",
                  "Verification of deletion process",
                  "Native performance with Rust backend",
                  "Modern, intuitive user interface",
                  "Dark and light theme support"
                ]}
                gradient="from-blue-500/10 to-orange-500/10"
              />

              <ChangelogSection
                items={[
                  {
                    version: "Version 1.0.0 (Current)",
                    changes: [
                      "Initial release of BitBurn",
                      "Multiple secure deletion algorithms",
                      "Progress tracking and statistics",
                      "Drag and drop support",
                      "System tray integration",
                      "Dark/light theme support"
                    ],
                  },
                ]}
                gradient="from-blue-500/10 to-orange-500/10"
              />
            </UtilityCard>
          </section>

          {/* EventSleuth Section */}
          <section id="eventsleuth" className="utility-section">
            <UtilityCard
              title="EventSleuth"
              version="1.0.0"
              description="Advanced Windows Event Log Analyzer"
              gradient="from-purple-400 via-pink-500 to-red-500"
              downloadCount={downloadCounts.EventSleuth}
              sha256="c9accd54ed543c19de089b4ea95bd9f8133a33722e539583c33734c4684c2b4f"
              downloadLink="/static/downloads/EventSleuth/EventSleuth.exe"
              onDownload={() => handleDownload("EventSleuth")}
            >
              <p className="text-muted-foreground text-center">
                A powerful Windows event log analyzer built with Tauri and React, providing a modern, 
                user-friendly interface for searching and analyzing Windows event logs with advanced 
                filtering capabilities and multiple theme options.
              </p>

              <ScreenshotViewer
                screenshots={eventSleuthScreenshots}
                utility="EventSleuth"
              />

              <FeaturesSection
                title="Analysis Features"
                features={[
                  "Advanced full-text search with keyword highlighting",
                  "Multiple theme options including Dark, Light, and specialty themes",
                  "Date range and event type filtering",
                  "Source and Event ID filtering capabilities",
                  "Export results to CSV format",
                  "System tray integration",
                  "Cross-window state persistence",
                  "Native Windows performance with Rust backend"
                ]}
                gradient="from-purple-400/10 via-pink-500/10 to-red-500/10"
              />

              <ChangelogSection
                items={[
                  {
                    version: "Version 1.0.0 (Current)",
                    changes: [
                      "Initial release of EventSleuth",
                      "Advanced search functionality",
                      "Multiple theme support",
                      "CSV export capability",
                      "System tray integration"
                    ],
                  },
                ]}
                gradient="from-purple-400/10 via-pink-500/10 to-red-500/10"
              />
            </UtilityCard>
          </section>

          {/* ConnectX Section */}
          <section id="connectx" className="utility-section">
            <UtilityCard
              title="ConnectX"
              version="1.1.0"
              description="Remote Desktop Connection Manager"
              gradient="from-purple-400 to-pink-600"
              downloadCount={downloadCounts.ConnectX}
              sha256="70f23c5cf61c0fe1699b15fb57f772e5c8182dc937f55b46ccc15d0ace6ea4ec"
              downloadLink="/static/downloads/ConnectX/ConnectX.exe"
              onDownload={() => handleDownload("ConnectX")}
            >
              <p className="text-muted-foreground text-center">
                A Windows application designed for system administrators to
                simplify connecting to multiple RDP hosts. It enables you to save
                and search a list of hosts and associated descriptions for easy
                RDP connection.
              </p>

              <ScreenshotViewer
                screenshots={ConnectXScreenshots}
                utility="ConnectX"
              />

              <FeaturesSection
                title="Remote Connection Features"
                features={[
                  "Secure credential management using Windows Credential Manager",
                  "Active Directory domain scanning for server discovery",
                  "Easy hostname and description management",
                  "Quick search functionality",
                  "Double-click RDP connection launch",
                  "System tray integration",
                ]}
                gradient="from-purple-500/10 to-pink-500/10"
              />

              <ChangelogSection
                items={[
                  {
                    version: "Version 1.1.0",
                    changes: ["Added search functionality to the manage hosts window"]
                  },
                  {
                    version: "Version 1.0.0",
                    changes: ["Initial release of ConnectX"],
                  },
                ]}
                gradient="from-purple-500/10 to-pink-500/10"
              />
            </UtilityCard>
          </section>

          {/* ChecksumCheck Section */}
          <section id="checksumcheck" className="utility-section">
            <UtilityCard
              title="ChecksumCheck"
              version="1.3.0"
              description="Fast and Simple File Checksum Verification Tool"
              gradient="from-red-500 to-gray-800"
              downloadCount={downloadCounts.ChecksumCheck}
              sha256="ed69929a5b255406213a3773768f7ed3c6f1d896c3431292a2419760389542d2"
              downloadLink="/static/downloads/ChecksumCheck/ChecksumCheck.exe"
              onDownload={() => handleDownload("ChecksumCheck")}
            >
              <p className="text-muted-foreground text-center">
                A lightweight utility built in Rust for quick and reliable file
                checksum verification. Supports multiple hash algorithms including
                MD5, SHA-1, SHA-256, and SHA-512 with an intuitive interface.
              </p>

              <ScreenshotViewer
                screenshots={ChecksumCheckScreenshots}
                utility="ChecksumCheck"
              />

              <FeaturesSection
                title="Verification Capabilities"
                features={[
                  "Multiple hash algorithm support (MD5, SHA-1, SHA-256, SHA-512)",
                  "Dark and Light theme modes",
                  "System tray integration",
                  "Drag and drop file support",
                  "Native file picker integration",
                  "Fast hash calculation powered by Rust and Tauri 2.0",
                  "Simple and intuitive interface",
                  "Copy hash results to clipboard",
                  "Visual feedback for hash verification",
                ]}
                gradient="from-red-500/20 to-gray-800/20"
              />

              <ChangelogSection
                items={[
                  {
                    version: "1.3.0 (Current)",
                    changes: [
                      "Re-written in Tauri 2.0",
                      "Added Dark/Light theme mode",
                      "Added System Tray functionality",
                    ],
                  },
                  {
                    version: "1.2.0",
                    changes: [
                      "Fixed white screen issue",
                      "No installation required",
                    ],
                  },
                ]}
                gradient="from-red-500/20 to-gray-800/20"
              />
            </UtilityCard>
          </section>

          {/* PSTInsight Section */}
          <section id="pstinsight" className="utility-section">
            <UtilityCard
              title="PSTInsight"
              version="2.3.0"
              description="PST File Viewer and Export Utility"
              gradient="from-blue-400 to-purple-600"
              downloadCount={downloadCounts.PSTInsight}
              sha256="bd22494f0d5a44f4dfaaed14ae8d6b91e0f3e2284786631c04b41213b35402de"
              downloadLink="/static/downloads/PSTInsight/PSTInsight.exe"
              onDownload={() => handleDownload("PSTInsight")}
            >
              <p className="text-muted-foreground text-center">
                PSTInsight is designed to view, search, and export emails from PST
                files. It provides an intuitive interface for efficiently managing
                and extracting emails. As of version 2.0.0, PSTInsight no longer
                requires Outlook to be installed.
              </p>

              <ScreenshotViewer
                screenshots={pstInsightScreenshots}
                utility="PSTInsight"
              />

              <FeaturesSection
                title="Email Management Tools"
                features={[
                  "Application Memory: Remembers last loaded PST files",
                  "Multiple PST File Support with drag-and-drop loading",
                  "Intuitive folder navigation with tree view",
                  "Advanced search functionality with real-time filtering",
                  "Selective email export with checkbox selection",
                  "Built-in attachment management",
                  "HTML-formatted email preview",
                ]}
                gradient="from-blue-500/10 to-purple-500/10"
              />

              <ChangelogSection
                items={[
                  {
                    version: "Version 2.3.0 (Current)",
                    changes: ["Various bug fixes"],
                  },
                  {
                    version: "Version 2.2.0",
                    changes: [
                      "Significant performance enhancements",
                      "Backend code refactorisation",
                      "Various bug fixes and improvements",
                    ],
                  },
                  {
                    version: "Version 2.1.0",
                    changes: [
                      "Added item count display in treeview folders",
                      "Fixed export overwrite issues",
                      "Various bug fixes and stability improvements",
                    ],
                  },
                  {
                    version: "Version 2.0.0",
                    changes: [
                      "Removed dependency on Microsoft Outlook",
                      "Integrated XstReader for PST file reading capabilities",
                      "Implemented MsgKit for MSG file creation and manipulation",
                      "Improved overall performance and stability",
                    ],
                  },
                ]}
                gradient="from-blue-500/10 to-purple-500/10"
              />

              <AcknowledgementSection
                items={[
                  {
                    name: "XstReader",
                    url: "https://github.com/iluvadev/XstReader"
                  },
                  {
                    name: "MsgKit",
                    url: "https://github.com/Sicos1977/MsgKit"
                  }
                ]}
                description="PSTInsight 2.0.0 utilizes two excellent open-source projects:"
                gradient="from-blue-500/10 to-purple-500/10"
              />
            </UtilityCard>
          </section>

          {/* GitHub Discussions Section */}
          <section id="github-discussions" className="utility-section">
            <Card className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <span className="bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                    GitHub Discussions
                  </span>
                </CardTitle>
                <CardDescription className="text-center">
                  Join the conversation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-center">
                  Ask questions, report bugs, share suggestions, and engage with
                  other users on the GitHub Discussions page.
                </p>

                <div className="rounded-lg border bg-gradient-to-br from-gray-500/10 to-gray-700/10 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-center">
                    Why Participate?
                  </h3>
                  <ul className="space-y-2 text-muted-foreground flex flex-col items-center">
                    {discussionReasons.map((reason, index) => (
                      <li
                        key={index}
                        className={`flex items-center animate-fade-up delay-${index}`}
                      >
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105"
                  >
                    <Link
                      href="https://github.com/Swatto86/swatto.github.io/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Visit Discussions
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Security Note */}
          <div
            className="rounded-lg border bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 text-center 
                  transform transition-all duration-300 hover:scale-[1.01] animate-fade-up"
          >
            <h3
              className={cn(
                "mb-2 text-lg font-semibold",
                "text-foreground", // Default color
                "[data-theme='colourful']:text-[hsl(60,100%,70%)]" // Colourful theme override
              )}
            >
              Security Note
            </h3>
            <p className="text-muted-foreground">
              All applications provided here are guaranteed to be free from
              malware and viruses. However, for your peace of mind, I recommend
              scanning any downloaded files with your preferred antivirus
              software/service before running them.
            </p>
          </div>

          {/* Footer */}
          <footer className="py-6 text-center text-sm text-muted-foreground border-t animate-fade-up">
            {/* Certification Note */}
            <div className="text-center space-y-4 animate-fade-up mb-6">
              <p className="text-muted-foreground">
                I&apos;m considering obtaining a code signing certificate in the
                future to shrink-wrap some trust into the utilities I provide. Your
                feedback and usage of the tools will help inform this decision!
              </p>

              {/* Contact */}
              <div className="group">
                <a
                  href="mailto:feedback@swatto.co.uk"
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  feedback@swatto.co.uk
                  <ExternalLink className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            <p>© {new Date().getFullYear()} Swatto. All rights reserved.</p>
          </footer>
        </div>
      </div>

      {/* News Feeds */}
      <NewsProvider>
        {/* Right News Feed - Fixed Position */}
        <aside className="hidden lg:block fixed right-0 top-0 w-64 h-screen border-l bg-background px-6 py-8 overflow-y-auto">
          <NewsFeed />
        </aside>
        {/* Mobile News Feed */}
        <div className="lg:hidden px-4 py-6 mt-4 border-t bg-background">
          <NewsFeed />
        </div>
      </NewsProvider>
    </>
  );
}
