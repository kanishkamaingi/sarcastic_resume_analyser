// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const resume = formData.get('resume');
  const jobDescription = formData.get('jobDescription');

  if (!resume || !jobDescription) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Simulated analysis
  return NextResponse.json({
    matchPercentage: 73,
    sarcasticFeedback: [
      "Your resume screams 'I'm allergic to job descriptions.'",
      "Half of your skills look like buzzwords thrown at random.",
      "But hey, at least you spelled your name right. Probably."
    ]
  });
}

