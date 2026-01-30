import * as React from "react";
import Image from "next/image";
import { SectionHeadline } from "@/components/ui/section-headline";

export function AboutTeam() {
  return (
    <section className="relative w-full bg-bg z-12" data-background="dark">
      {/* Content wrapper - excludes rounded corners so headline unsticks naturally */}
      <div>
        {/* Section Headline */}
        <SectionHeadline
          title="Team"
          number="/01"
          codeLeft="executeSearch ( teamMembers, philosophy ) {"
          className="pt-9 md:pt-4"
        />

        {/* Paragraph Content */}
        <div className="flex flex-col gap-6 items-start px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-24 text-fg max-w-7xl mx-auto">
          <p className="font-body font-light text-base md:text-lg lg:text-xl leading-[1.5] max-w-4xl">
            With industry experience spanning e-commerce, insurance, FinTech, Retail, and Hospitality. Designing and building hundreds of projects over the years across the web and mobile applications. There&apos;s really nothing we can&apos;t do.
          </p>
        </div>

        {/* Decorative Line */}
        <div className="px-6 md:px-12 lg:px-20 max-w-7xl">
          <div className="w-full max-w-4xl -mx-6 md:-mx-8 lg:-mx-12">
            <div className="h-px w-full bg-accent" />
          </div>
        </div>

        {/* Members Section - Two Columns */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-start px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-24 max-w-7xl mx-auto">
          
          {/* Ben White */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Image */}
            <div className="relative w-full aspect-[556/371] rounded-lg shadow-photo overflow-hidden">
              <Image
                src="/images/ben-white.png"
                alt="Ben White"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Bio */}
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex flex-col">
                <h3 className="font-header text-4xl md:text-5xl lg:text-6xl leading-none tracking-[-0.03em] text-fg">
                  Ben White
                </h3>
                <p className="font-body font-light text-sm leading-[1.5] text-accent">
                  Co-Founder & Studio Manager
                </p>
              </div>
              
              {/* Description */}
              <p className="font-body font-light text-sm md:text-base leading-[1.5] text-fg">
                Ben is the point person for all communications and sales. He has a wealth of talent identifying costs, timelines, assessing the needs of a project, and researching requirements. Ben keeps projects on time, under budget, and notifies clients along every step of the way.
              </p>
            </div>
          </div>

          {/* Sam Daugherty */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Image */}
            <div className="relative w-full aspect-[556/371] rounded-lg shadow-photo overflow-hidden">
              <Image
                src="/images/sam-daugherty.png"
                alt="Sam Daugherty"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Bio */}
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex flex-col">
                <h3 className="font-header text-4xl md:text-5xl lg:text-6xl leading-none tracking-[-0.03em] text-fg">
                  Sam Daugherty
                </h3>
                <p className="font-body font-light text-sm leading-[1.5] text-accent">
                  Co-Founder & Lead Designer
                </p>
              </div>
              
              {/* Description */}
              <p className="font-body font-light text-sm md:text-base leading-[1.5] text-fg">
                Sam is a User Experience & Digital Product Designer. Over the past 18 years, he&apos;s worked with companies large and small, global and local, designing engaging experiences on both web and mobile. He has an eye for detail and extensive experience building pixel-perfect applications.
              </p>
            </div>
          </div>
        </div>

        {/* Quote/Philosophy Section with Corner Borders */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-14 items-start md:items-center px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-24 max-w-7xl mx-auto text-center text-fg">
          
          {/* Top-left corner border */}
          <div className="w-8 h-8 border-l-2 border-t-2 border-accent shrink-0 self-start -mb-12 md:-mb-0" />
          
          {/* Content */}
          <div className="flex-1 flex flex-col gap-4">
            <h3 className="font-header text-3xl md:text-4xl lg:text-5xl leading-none tracking-[-0.03em]">
              Small team, <span className="text-accent">big results</span>
            </h3>
            <p className="font-body font-light text-base md:text-lg lg:text-xl leading-[1.5]">
              We don&apos;t believe in cookie cutter designs. We don&apos;t believe in playing safe, and thinking small. We believe that every project deserves our full attention and creative spirit. We&apos;re passionate about good design, and that design thinking is a craft that drives businesses forward.
            </p>
          </div>
          
          {/* Bottom-right corner border (rotated 180°) */}
          <div className="w-8 h-8 border-l-2 border-t-2 border-accent shrink-0 rotate-180 self-end -mt-12 md:-mt-0" />
        </div>
      </div>
      {/* End content wrapper */}

      {/* Rounded Corner Transition */}
      <div className="bg-fg pt-0 pb-8 md:pb-14">
        <div className="bg-bg w-full h-12 md:h-28 rounded-bl-[80px] md:rounded-bl-[112px] rounded-br-[80px] md:rounded-br-[112px] shadow-clock" />
      </div>
    </section>
  );
}

