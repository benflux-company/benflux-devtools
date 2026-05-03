import { PrismaClient, Role, ToolSlug, ChallengeStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Benflux DevTools database...');

  // ─── Tools ────────────────────────────────────────────────────────────────
  const tools = [
    {
      slug: ToolSlug.JSON_FORMATTER,
      name: 'JSON Formatter',
      description: 'Format, validate, and minify JSON data with syntax highlighting.',
      icon: '{}',
      isLive: true,
      weekNumber: 1,
    },
    {
      slug: ToolSlug.JWT_DECODER,
      name: 'JWT Decoder',
      description: 'Decode and inspect JSON Web Tokens without a secret.',
      icon: '🔐',
      isLive: false,
      weekNumber: 2,
    },
    {
      slug: ToolSlug.PASSWORD_GENERATOR,
      name: 'Password Generator',
      description: 'Generate strong, customizable passwords instantly.',
      icon: '🔑',
      isLive: false,
      weekNumber: 3,
    },
    {
      slug: ToolSlug.MARKDOWN_PREVIEW,
      name: 'Markdown Preview',
      description: 'Write and preview Markdown in real-time with live rendering.',
      icon: '📝',
      isLive: false,
      weekNumber: 4,
    },
    {
      slug: ToolSlug.REGEX_TESTER,
      name: 'Regex Tester',
      description: 'Test and debug regular expressions with match highlighting.',
      icon: '🔍',
      isLive: false,
      weekNumber: 5,
    },
    {
      slug: ToolSlug.API_TESTER,
      name: 'API Tester',
      description: 'Send HTTP requests and inspect responses in-browser.',
      icon: '🌐',
      isLive: false,
      weekNumber: 6,
    },
    {
      slug: ToolSlug.BASE64_TOOL,
      name: 'Base64 Tool',
      description: 'Encode and decode Base64 strings and files.',
      icon: '🔤',
      isLive: false,
      weekNumber: 7,
    },
  ];

  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: tool,
      create: tool,
    });
  }

  console.log('✅ Tools seeded');

  // ─── Admin User ───────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { githubId: 'benflux-admin' },
    update: {},
    create: {
      githubId: 'benflux-admin',
      username: 'benflux-admin',
      email: 'admin@benflux.dev',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
      role: Role.ADMIN,
      wallet: { create: { balance: 1000 } },
    },
  });

  console.log('✅ Admin user seeded:', admin.username);

  // ─── Week 1 Challenge: JSON Formatter ─────────────────────────────────────
  const jsonFormatterTool = await prisma.tool.findUniqueOrThrow({
    where: { slug: ToolSlug.JSON_FORMATTER },
  });

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 7);

  const challenge = await prisma.challenge.upsert({
    where: { week_year: { week: 1, year: 2025 } },
    update: {},
    create: {
      title: 'Week 1: Build the JSON Formatter Tool',
      description:
        'Build a fully featured JSON Formatter that helps developers format, validate, and minify JSON data. ' +
        'This tool must have syntax highlighting, error messages, copy functionality, and a minify toggle.',
      week: 1,
      year: 2025,
      toolId: jsonFormatterTool.id,
      status: ChallengeStatus.ACTIVE,
      totalPoints: 100,
      rewardPool: 100,
      startDate: now,
      endDate,
    },
  });

  console.log('✅ Week 1 challenge seeded');

  // ─── Week 1 Tasks ─────────────────────────────────────────────────────────
  const tasks = [
    {
      title: 'JSON Input Textarea',
      description:
        'Create a large, resizable textarea where developers can paste their raw JSON data. ' +
        'The textarea should support multi-line input and have a placeholder text.',
      acceptanceCriteria:
        '- Textarea renders correctly\n' +
        '- Placeholder text is helpful\n' +
        '- Input is accessible (label, aria)\n' +
        '- Handles large JSON inputs (10,000+ chars)',
      points: 10,
      label: 'easy',
    },
    {
      title: 'JSON Format & Pretty Print',
      description:
        'Implement the core formatting logic. When the user clicks "Format", parse the JSON and ' +
        'display it with proper indentation (2 spaces). Handle and display parse errors gracefully.',
      acceptanceCriteria:
        '- Valid JSON is formatted with 2-space indentation\n' +
        '- Invalid JSON shows clear error message\n' +
        '- Empty input shows appropriate message\n' +
        '- Formatted output is displayed in a read-only output area',
      points: 20,
      label: 'medium',
    },
    {
      title: 'Syntax Highlighting',
      description:
        'Add syntax highlighting to the formatted JSON output. Keys should be one color, ' +
        'strings another, numbers another, and booleans/null another.',
      acceptanceCriteria:
        '- Keys highlighted in blue/purple\n' +
        '- String values highlighted in green\n' +
        '- Numbers highlighted in orange\n' +
        '- Booleans and null highlighted in red\n' +
        '- Colors work in both light and dark mode',
      points: 20,
      label: 'medium',
    },
    {
      title: 'Error Handling & Validation',
      description:
        'Implement robust error handling. Show the exact line and character position of JSON errors. ' +
        'Display user-friendly error messages.',
      acceptanceCriteria:
        '- Error shows line number and column\n' +
        '- Error message is human-readable\n' +
        '- Error state is visually distinct (red border, icon)\n' +
        '- No unhandled JavaScript errors',
      points: 15,
      label: 'medium',
    },
    {
      title: 'Copy to Clipboard Button',
      description:
        'Add a "Copy" button that copies the formatted JSON to the clipboard. ' +
        'Show a success state (checkmark) for 2 seconds after copying.',
      acceptanceCriteria:
        '- Copy button is visible and accessible\n' +
        '- Copies formatted JSON to clipboard\n' +
        '- Shows success feedback for 2 seconds\n' +
        '- Works across all modern browsers',
      points: 10,
      label: 'easy',
    },
    {
      title: 'Clear Button',
      description:
        'Add a "Clear" button that resets both the input textarea and the output display. ' +
        'Should also reset any error states.',
      acceptanceCriteria:
        '- Clear button resets input to empty\n' +
        '- Clear button resets output to empty\n' +
        '- Error state is cleared\n' +
        '- Focus returns to input after clear',
      points: 5,
      label: 'easy',
    },
    {
      title: 'Minify Toggle',
      description:
        'Add a "Minify" toggle/button that removes all whitespace from the JSON. ' +
        'Toggling between Formatted and Minified views.',
      acceptanceCriteria:
        '- Minify button compresses JSON to single line\n' +
        '- Toggle switches between formatted and minified\n' +
        '- Minified output is valid JSON\n' +
        '- Button state reflects current mode',
      points: 20,
      label: 'hard',
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        challengeId: challenge.id,
        ...task,
      },
    });
  }

  console.log('✅ Week 1 tasks seeded (7 tasks, 100 points total)');
  console.log('\n🎉 Seeding complete!');
  console.log('   Admin login: use GitHub OAuth with username "benflux-admin"');
  console.log('   API docs: http://localhost:4000/api/docs');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
