import {
  BarChart3,
  Blocks,
  BriefcaseBusiness,
  CloudCog,
  Code2,
  Gamepad2,
  Handshake,
  Megaphone,
  Palette,
  PenTool,
  Smartphone,
  Trophy,
} from "lucide-react";

export const SITE = {
  name: "GDG on Campus",
  campus: "VIT Chennai",
  year: "2026",
  applicationLimit: 2,
  // Configure this on deployment rather than hard-coding an expired date.
  deadline: process.env.NEXT_PUBLIC_RECRUITMENT_DEADLINE || null,
};

export const LINKS = {
  instagram: "#",
  linkedin: "#",
  discord: "#",
  email: "#",
};

export const reviews = [
  {
    id: "management", slug: "management", name: "Management", shortName: "Management", icon: BriefcaseBusiness, accent: "blue",
    description: "Bring clarity to ambitious ideas through thoughtful planning, coordination, and leadership.",
    skills: ["Planning", "Leadership", "Ownership"],
  },
  {
    id: "publicity", slug: "publicity", name: "Publicity", shortName: "Publicity", icon: Megaphone, accent: "red",
    description: "Shape campaigns that make the right people stop, notice, and join the conversation.",
    skills: ["Campaigns", "Copywriting", "Strategy"],
  },
  {
    id: "outreach", slug: "outreach", name: "Outreach", shortName: "Outreach", icon: Handshake, accent: "yellow",
    description: "Build meaningful relationships and make every collaboration feel genuinely welcoming.",
    skills: ["Communication", "Community", "Initiative"],
  },
  {
    id: "ui-ux", slug: "ui-ux", name: "UI/UX", shortName: "UI/UX", icon: Palette, accent: "green",
    description: "Design intuitive digital experiences where visual craft and empathy meet.",
    skills: ["Figma", "Research", "Systems"],
  },
  {
    id: "creatives", slug: "creatives", name: "Creatives", shortName: "Creatives", icon: PenTool, accent: "red",
    description: "Turn ideas into memorable visual stories across social, print, and event moments.",
    skills: ["Visual craft", "Storytelling", "Ideas"],
  },
  {
    id: "web-dev", slug: "web-dev", name: "Web Dev", shortName: "Web Dev", icon: Code2, accent: "blue",
    description: "Craft fast, thoughtful web experiences from the first sketch to a reliable deployment.",
    skills: ["React", "APIs", "UI systems"],
  },
  {
    id: "app-dev", slug: "app-dev", name: "App Dev", shortName: "App Dev", icon: Smartphone, accent: "green",
    description: "Build mobile experiences that feel useful, polished, and at home in people’s hands.",
    skills: ["Mobile", "Product thinking", "APIs"],
  },
  {
    id: "game-dev", slug: "game-dev", name: "Game Dev", shortName: "Game Dev", icon: Gamepad2, accent: "yellow",
    description: "Explore playful systems, compelling mechanics, and the craft behind interactive worlds.",
    skills: ["Unity", "Gameplay", "Creativity"],
  },
  {
    id: "data-science", slug: "data-science", name: "Data Science", shortName: "Data", icon: BarChart3, accent: "blue",
    description: "Use data to discover patterns, ask better questions, and make ideas measurable.",
    skills: ["Python", "Analytics", "ML"],
  },
  {
    id: "blockchain", slug: "blockchain", name: "Blockchain", shortName: "Blockchain", icon: Blocks, accent: "red",
    description: "Investigate decentralised technology and the practical systems it can unlock.",
    skills: ["Web3", "Smart contracts", "Curiosity"],
  },
  {
    id: "cloud-devops", slug: "cloud-devops", name: "Cloud & DevOps", shortName: "Cloud", icon: CloudCog, accent: "green",
    description: "Make projects dependable with cloud foundations, automation, and deployment craft.",
    skills: ["Cloud", "CI/CD", "Automation"],
  },
  {
    id: "competitive-programming", slug: "competitive-programming", name: "Competitive Programming", shortName: "CP", icon: Trophy, accent: "yellow",
    description: "Sharpen problem-solving through algorithms, patterns, and friendly competition.",
    skills: ["DSA", "Algorithms", "Practice"],
  },
];

export const QuestionnaireData = [
  {
    department: "Management",
    questions: [
      { id: "management-plan", name: "How would you take an event idea from a first discussion to a smooth on-campus experience?", type: "long-text", required: true, placeholder: "Share how you would plan, coordinate, and follow through." },
      { id: "management-strength", name: "What is a leadership or organisation strength you would bring to the department?", type: "long-text", required: true, placeholder: "A small example is welcome." },
    ],
  },
  {
    department: "Publicity",
    questions: [
      { id: "publicity-campaign", name: "What would a strong campaign for a GDG on Campus event look like to you?", type: "long-text", required: true, placeholder: "Think about message, channels, and timing." },
      { id: "publicity-work", name: "Link any campaign, copy, or social work you would like us to see (optional).", type: "short-text", required: false, placeholder: "https://…" },
    ],
  },
  {
    department: "Outreach",
    questions: [
      { id: "outreach-invite", name: "How would you invite a student who has never attended a tech event to their first session?", type: "long-text", required: true, placeholder: "Make it practical and personal." },
      { id: "outreach-relationship", name: "What makes a collaboration or community partnership valuable in your view?", type: "long-text", required: true, placeholder: "Share your perspective." },
    ],
  },
  {
    department: "UI/UX",
    questions: [
      { id: "uiux-work", name: "Share a design, interface, or visual idea you are proud of. What was your thinking?", type: "long-text", required: true, placeholder: "A link is welcome, but not required." },
      { id: "uiux-observe", name: "Name one everyday experience you would redesign and why.", type: "long-text", required: true, placeholder: "Focus on the people using it." },
    ],
  },
  {
    department: "Creatives",
    questions: [
      { id: "creatives-story", name: "What campus story would you want to turn into a memorable visual or creative piece?", type: "long-text", required: true, placeholder: "Tell us about the idea and medium." },
      { id: "creatives-work", name: "Link any portfolio or work you would like us to see (optional).", type: "short-text", required: false, placeholder: "https://…" },
    ],
  },
  {
    department: "Web Dev",
    questions: [
      { id: "web-build", name: "Tell us about something you have built, explored, or would love to build for the web.", type: "long-text", required: true, placeholder: "A project, idea, or problem that interests you…" },
      { id: "web-learn", name: "How do you approach learning a tool you have never used before?", type: "long-text", required: true, placeholder: "Share your process in a few sentences." },
    ],
  },
  {
    department: "App Dev",
    questions: [
      { id: "app-idea", name: "What useful mobile experience would you like to build for students, and why?", type: "long-text", required: true, placeholder: "Describe the problem and your first idea." },
      { id: "app-learn", name: "What mobile or product skill would you like to develop next?", type: "long-text", required: true, placeholder: "Prior experience is not required." },
    ],
  },
  {
    department: "Game Dev",
    questions: [
      { id: "game-mechanic", name: "Describe a game mechanic or interactive idea that you find especially compelling.", type: "long-text", required: true, placeholder: "Explain what makes it work." },
      { id: "game-build", name: "What kind of game or interactive project would you enjoy creating with the department?", type: "long-text", required: true, placeholder: "An early idea is enough." },
    ],
  },
  {
    department: "Data Science",
    questions: [
      { id: "data-question", name: "What data question would you like to investigate with a department?", type: "long-text", required: true, placeholder: "It can be ambitious; explain why it matters." },
      { id: "data-learn", name: "Describe a technical concept you recently taught yourself or want to learn next.", type: "long-text", required: true, placeholder: "We value curiosity over prior experience." },
    ],
  },
  {
    department: "Blockchain",
    questions: [
      { id: "blockchain-use", name: "What practical problem do you think decentralised technology could help address?", type: "long-text", required: true, placeholder: "Focus on the people and the problem first." },
      { id: "blockchain-learn", name: "What aspect of blockchain or Web3 are you most curious to explore?", type: "long-text", required: true, placeholder: "An honest question is a great answer." },
    ],
  },
  {
    department: "Cloud & DevOps",
    questions: [
      { id: "cloud-reliable", name: "What makes a project reliable when many people depend on it?", type: "long-text", required: true, placeholder: "Think deployment, automation, monitoring, or process." },
      { id: "cloud-learn", name: "Which cloud or DevOps concept would you like to understand better?", type: "long-text", required: true, placeholder: "Prior experience is not required." },
    ],
  },
  {
    department: "Competitive Programming",
    questions: [
      { id: "cp-problem", name: "What draws you to algorithmic problem-solving or competitive programming?", type: "long-text", required: true, placeholder: "Share your interest or a problem you enjoyed." },
      { id: "cp-practice", name: "How would you build a consistent practice habit while balancing college work?", type: "long-text", required: true, placeholder: "Tell us about your approach." },
    ],
  },
];

export const allQuestions = (departmentNames) =>
  QuestionnaireData.filter((group) => departmentNames.includes(group.department)).flatMap(
    (group) => group.questions.map((question) => ({ ...question, department: group.department })),
  );
