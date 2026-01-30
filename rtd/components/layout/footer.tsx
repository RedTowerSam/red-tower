import Link from "next/link";

const footerLinks = [
  [
    { href: "/about", label: "About" },
    { href: "/work", label: "Work" },
  ],
  [
    { href: "/process", label: "Process" },
    { href: "/contact", label: "Contact" },
  ],
  [
    { label: "Socials", disabled: true },
    { href: "/login", label: "Log in" },
  ],
];

export function Footer() {
  return (
    <footer className="relative z-10 bg-bg border-b-8 border-accent">
      {/* Main Footer Content */}
      <div className="px-6 lg:px-14 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-6 items-center">
          {/* Contact Section */}
          <div className="flex flex-col gap-3 items-center lg:items-start flex-1 w-full lg:w-auto">
            <p className="font-header text-2xl leading-none text-accent">
              RDTWR
            </p>
            <p className="font-header text-[24px] sm:text-[32px] leading-none tracking-[-0.96px] text-fg">
              hello@redtowerdigital.com
            </p>
          </div>

          {/* No Socials Section */}
          <div className="flex flex-col items-center flex-1">
            <p className="font-header text-[24px] sm:text-[32px] leading-none tracking-[-0.96px] text-fg text-center whitespace-nowrap -mb-8">
              Sorry, no socials
            </p>
            <div className="relative -mb-8">
              <p className="font-subhead text-[48px] sm:text-[64px] leading-none text-accent text-center whitespace-nowrap rotate-[-2deg]">
                we just can't stand 'em
              </p>
            </div>
          </div>

          {/* Links Section */}
          <div className="flex gap-8 items-start justify-between lg:justify-end flex-1 w-full lg:w-auto">
            {footerLinks.map((column, idx) => (
              <div key={idx} className="flex flex-col gap-4 w-16">
                {column.map((link, linkIdx) => (
                  <div key={linkIdx} className="relative">
                    {link.href ? (
                      <Link
                        href={link.href}
                        className="font-body font-light text-base leading-[1.5] text-fg hover:text-accent transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span className="font-body font-light text-base leading-[1.5] text-fg/50">
                        {link.label}
                      </span>
                    )}
                    {link.disabled && (
                      <div className="absolute left-[-4px] top-[13px] h-[2px] w-[69px] bg-accent" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-5 pb-6 px-6">
        <p className="font-body font-light text-sm lg:text-[14px] leading-[1.5] text-fg whitespace-nowrap">
          © {new Date().getFullYear()} Red Tower Digital
        </p>
        <p className="font-body font-light text-sm lg:text-[14px] leading-[1.5] text-accent whitespace-nowrap hidden md:block">|</p>
        <p className="font-body font-light text-sm lg:text-[14px] leading-[1.5] text-fg whitespace-nowrap">
          Please don't steal our stuff
        </p>
      </div>
    </footer>
  );
}

