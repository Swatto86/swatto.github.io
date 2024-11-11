"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { HeroSection } from "@/components/sections/hero-section";
import { UtilityCard } from "@/components/sections/utility-card";
import { ChangelogSection } from "@/components/sections/changelog-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { ScreenshotViewer } from "@/components/sections/screenshot-viewer";
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

interface DownloadCounts {
  PSTInsight: number;
  SwatLauncher: number;
  SwatLogSweep: number;
  ChecksumCheck: number;
  SimpleGit: number;
}

type UtilityName = keyof DownloadCounts;

export default function Home() {
  const { toast } = useToast();
  const [downloadCounts, setDownloadCounts] = useState<DownloadCounts>({
    PSTInsight: 0,
    SwatLauncher: 0,
    SwatLogSweep: 0,
    ChecksumCheck: 0,
    SimpleGit: 0,
  });

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    let isPolling = true;
    let errorCount = 0;
    const maxErrorCount = 3;
    const baseInterval = 60000; // 60 seconds
    const maxInterval = 300000; // 5 minutes

    const calculateInterval = () => {
      // Exponential backoff if there are errors
      return Math.min(baseInterval * Math.pow(2, errorCount), maxInterval);
    };

    const fetchCounts = async () => {
      if (!isPolling) return;

      try {
        const utilities: UtilityName[] = [
          "PSTInsight",
          "SwatLauncher",
          "SwatLogSweep",
          "ChecksumCheck",
        ];
        const counts = await Promise.all(
          utilities.map(async (utility) => {
            try {
              const response = await fetch(`/api/downloads?utility=${utility}`);
              if (!response.ok) {
                throw new Error(await response.text());
              }
              const data = await response.json();
              return { utility, count: data.count ?? 0 };
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

        setDownloadCounts(newCounts);

        // Reset error count on successful fetch
        errorCount = 0;
      } catch (error) {
        console.error("Failed to fetch download counts:", error);
        errorCount = Math.min(errorCount + 1, maxErrorCount);
      }

      // Schedule next poll if still active
      if (isPolling) {
        pollInterval = setTimeout(fetchCounts, calculateInterval());
      }
    };

    const startPolling = () => {
      isPolling = true;
      fetchCounts();
    };

    const stopPolling = () => {
      isPolling = false;
      if (pollInterval) {
        clearTimeout(pollInterval);
        pollInterval = null;
      }
    };

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    fetchCounts();

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopPolling();
    };
  }, []);

  const handleDownload = async (utility: UtilityName) => {
    try {
      const response = await fetch("/api/downloads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ utility }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Failed to increment download count"
        );
      }

      const data = await response.json();

      if (data.success) {
        setDownloadCounts((prev) => ({
          ...prev,
          [utility]: data.count,
        }));

        toast({
          title: "Download Started",
          description: `${utility} download has started. Thank you for using my tools!`,
          duration: 5000,
        });
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Failed to increment download count:", error);
      toast({
        title: "Download Started",
        description:
          "Download tracking failed, but your download should start shortly.",
        duration: 5000,
      });
      return Promise.resolve();
    }
  };

  const ChecksumCheckScreenshots = [
    { src: "/images/checksumcheck/main.png", alt: "main" },
    { src: "/images/checksumcheck/checksum_results.png", alt: "results" },
  ];

  const pstInsightScreenshots = [
    { src: "/images/pstinsight/main.png", alt: "main" },
    { src: "/images/pstinsight/search.png", alt: "results" },
  ];

  const swatLauncherScreenshots = [
    { src: "/images/swatlauncher/main.png", alt: "main" },
    { src: "/images/swatlauncher/manage_hosts.png", alt: "manage" },
    { src: "/images/swatlauncher/rdp_creds.png", alt: "rdp" },
  ];

  const swatLogSweepScreenshots = [
    { src: "/images/swatlogsweep/main.png", alt: "main" },
    { src: "/images/swatlogsweep/search.png", alt: "search" },
  ];

  const simpleGitScreenshots = [
    { src: "/images/simplegit/main.png", alt: "Main Interface" },
    { src: "/images/simplegit/diff.png", alt: "Visual Diff Viewer" },
    { src: "/images/simplegit/branches.png", alt: "Branch Management" },
  ];

  const discussionReasons = [
    "Submit bugs you have found with the utilities",
    "Get support from me directly",
    "Share ideas for new features or improvements",
    "Engage with other users",
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 space-y-20 pb-8">
        <HeroSection />

        {/* Simple-Git Section */}
        <section id="simplegit" className="utility-section">
          <UtilityCard
            title="Simple-Git"
            version="1.0.0"
            description="Modern, Lightweight Git Client"
            gradient="from-indigo-400 to-cyan-600"
            downloadCount={downloadCounts.SimpleGit}
            sha256="7890613a84083ceed00bb0259ef91526da52e7bf756b82af2aa26dcb64b08dfe"
            downloadLink="/static/downloads/SimpleGit/SimpleGit.exe"
            onDownload={() => handleDownload("SimpleGit")}
          >
            <p className="text-muted-foreground text-center">
              A modern, lightweight Git client built with Tauri, React, and
              TypeScript. Featuring a clean interface, native performance, and
              full Git operations support.
            </p>

            <ScreenshotViewer
              screenshots={simpleGitScreenshots}
              utility="SimpleGit"
            />

            <ChangelogSection
              items={[
                {
                  version: "1.0.0 (Current)",
                  changes: [
                    "Initial release with core Git operations",
                    "GitHub OAuth integration",
                    "Visual diff viewer",
                    "Multiple theme support",
                    "Cross-platform support",
                  ],
                },
              ]}
              gradient="from-indigo-500/10 to-cyan-500/10"
            />

            <FeaturesSection
              features={[
                "Fast and lightweight - built with Rust",
                "Cross-platform support (Windows, macOS, Linux)",
                "Modern UI with React and TypeScript",
                "Secure GitHub OAuth integration",
                "Full Git operations support",
                "Visual diff viewer",
                "Multiple theme options",
              ]}
              gradient="from-indigo-500/10 to-cyan-500/10"
            />
          </UtilityCard>
        </section>

        {/* ChecksumCheck Section */}
        <section id="checksumcheck" className="utility-section">
          <UtilityCard
            title="ChecksumCheck"
            version="1.2.0" // Changed from 0.1.0
            description="Fast and Simple File Checksum Verification Tool"
            gradient="from-red-500 to-gray-800"
            downloadCount={downloadCounts.ChecksumCheck}
            sha256="6c8ab8ac4c5339eb67227e54ef2a8da321cbaf5c036e7e7f4604d722fa45fe1ac"
            downloadLink="/static/downloads/ChecksumCheck/ChecksumCheck.exe"
            onDownload={() => handleDownload("ChecksumCheck")}
          >
            <p className="text-muted-foreground text-center">
              A lightweight utility built in Rust for quick and reliable file
              checksum verification. Supports multiple hash algorithms including
              MD5, SHA-1, SHA-256, and SHA-512 with an intuitive interface.
            </p>

            <FeaturesSection
              features={[
                "Multiple hash algorithm support (MD5, SHA-1, SHA-256, SHA-512)",
                "Drag and drop file support",
                "Native file picker integration",
                "Fast hash calculation powered by Rust",
                "Simple and intuitive interface",
                "Copy hash results to clipboard",
                "Visual feedback for hash verification",
              ]}
              gradient="from-red-500/20 to-gray-800/20"
            />

            <ScreenshotViewer
              screenshots={ChecksumCheckScreenshots}
              utility="ChecksumCheck"
            />

            <ChangelogSection
              items={[
                {
                  version: "1.2.0 (Current)",
                  changes: [
                    "Fixed white screen issue",
                    "No installation required",
                  ],
                },
                {
                  version: "1.1.0",
                  changes: [
                    "Support for MD5, SHA-1, SHA-256, and SHA-512 algorithms",
                    "Drag and drop file support",
                    "Native file picker integration",
                    "Hash verification functionality",
                    "Copy to clipboard feature",
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

            <FeaturesSection
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

            <div className="rounded-lg border bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6">
              <h3 className="mb-4 text-lg font-semibold text-center">
                Acknowledgments
              </h3>
              <p className="text-muted-foreground mb-4 text-center">
                PSTInsight 2.0.0 utilizes two excellent open-source projects:
              </p>
              <div className="space-y-2 flex flex-col items-center">
                <a
                  href="https://github.com/iluvadev/XstReader"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300 transition-colors group"
                >
                  <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  XstReader
                </a>
                <a
                  href="https://github.com/Sicos1977/MsgKit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-400 hover:text-blue-300 transition-colors group"
                >
                  <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  MsgKit
                </a>
              </div>
            </div>
          </UtilityCard>
        </section>

        {/* SwatLauncher Section */}
        <section id="swatlauncher" className="utility-section">
          <UtilityCard
            title="SwatLauncher"
            version="1.2.0"
            description="Remote Desktop Connection Manager"
            gradient="from-purple-400 to-pink-600"
            downloadCount={downloadCounts.SwatLauncher}
            sha256="0335ab2028d1db17f16a0473c3534b92199959246a6b870d128d524b572171b4"
            downloadLink="/static/downloads/SwatLauncher/SwatLauncher.exe"
            onDownload={() => handleDownload("SwatLauncher")}
          >
            <p className="text-muted-foreground text-center">
              A Windows application designed for system administrators to
              simplify connecting to multiple RDP hosts. It enables you to save
              and search a list of hosts and associated descriptions for easy
              RDP connection.
            </p>

            <ScreenshotViewer
              screenshots={swatLauncherScreenshots}
              utility="SwatLauncher"
            />

            <ChangelogSection
              items={[
                {
                  version: "Version 1.2.0 (Current)",
                  changes: [
                    "Added ability to add/modify credentials for individual hosts where required",
                  ],
                },
                {
                  version: "Version 1.1.0",
                  changes: [
                    "Removed window animations",
                    "Added 1 second timer to shift-key press to prevent accidental deletions",
                    "Various bug fixes and performance improvements",
                  ],
                },
                {
                  version: "Version 1.0.0",
                  changes: ["Initial release of SwatLauncher"],
                },
              ]}
              gradient="from-purple-500/10 to-pink-500/10"
            />

            <FeaturesSection
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

            <FeaturesSection
              features={[
                "Hold shift for 1 second on the Credential Input window to delete stored credentials",
                "Hold shift for 1 second on the Manage Hosts window to delete the CSV file",
                "Minimize/Close to system tray and right-click the icon to exit",
              ]}
              gradient="from-purple-500/10 to-pink-500/10"
              title="Useful Tips"
            />
          </UtilityCard>
        </section>

        {/* SwatLogSweep Section */}
        <section id="swatlogsweep" className="utility-section">
          <UtilityCard
            title="SwatLogSweep"
            version="1.2.0"
            description="Event Log Search Utility"
            gradient="from-green-400 to-blue-600"
            downloadCount={downloadCounts.SwatLogSweep}
            sha256="5b96acb06d484ee365b815e3f02e68ae94a649c38d587a9eaf4b7f3d29f7cac1"
            downloadLink="/static/downloads/SwatLogSweep/SwatLogSweep.exe"
            onDownload={() => handleDownload("SwatLogSweep")}
          >
            <p className="text-muted-foreground text-center">
              A Windows application designed for efficient searching of Windows
              event logs. It provides a user-friendly interface to search the
              entire event log for specific keywords and presents the results in
              an easy-to-read format.
            </p>

            <ScreenshotViewer
              screenshots={swatLogSweepScreenshots}
              utility="SwatLogSweep"
            />

            <ChangelogSection
              items={[
                {
                  version: "Version 1.2.0 (Current)",
                  changes: [
                    "Added export to CSV functionality",
                    "Improved searching algorithm",
                  ],
                },
                {
                  version: "Version 1.1.0",
                  changes: [
                    "Adjusted application layout",
                    "Added sorting capabilities to the ListView headers",
                    "Detection of Admin and Standard User run modes",
                    "Added Event ID searching",
                  ],
                },
                {
                  version: "Version 1.0.0",
                  changes: ["Initial release of SwatLogSweep"],
                },
              ]}
              gradient="from-green-500/10 to-blue-500/10"
            />

            <FeaturesSection
              features={[
                "Comprehensive log search across all Windows event logs",
                "Event ID search capability",
                "Clear results presentation",
                "Export to CSV functionality",
              ]}
              gradient="from-green-500/10 to-blue-500/10"
            />

            <FeaturesSection
              features={[
                "Run As Administrator for full event log access",
                "Select an event to highlight keyword matches in the description",
              ]}
              gradient="from-green-500/10 to-blue-500/10"
              title="Useful Tips"
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

        {/* Certification Note */}
        <div className="text-center space-y-4 animate-fade-up">
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

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-muted-foreground border-t animate-fade-up">
          <p>© {new Date().getFullYear()} Swatto. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
