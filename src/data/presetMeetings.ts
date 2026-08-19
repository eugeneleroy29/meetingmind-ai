import { PresetMeeting } from '@/types/meeting';

export const PRESET_MEETINGS: PresetMeeting[] = [
  {
    id: 'product-sync',
    title: 'Q4 AI Product Roadmap & Architecture Sync',
    duration: '45 mins',
    participants: ['Sarah (VP Product)', 'Eugene (Lead AI Eng)', 'Marcus (Head of Infra)'],
    transcript: `Sarah: Alright team, let's lock down our Q4 priorities. Eugene, where do we stand on the sub-second transcription pipeline?
Eugene: We migrated our STT layer over to Groq Whisper Turbo. Latency dropped from 2.4 seconds to under 450 milliseconds. However, we need to finalize the streaming token buffer before we launch to our enterprise beta group.
Marcus: From the infrastructure side, our rate limits on the primary cluster are holding steady at 8,000 RPM. But if we onboard the Fortune 500 trial next week, we need to provision a multi-region fallback pool.
Sarah: Eugene, can you commit to shipping the streaming token buffer by Thursday EOD? We have the investor showcase on Friday.
Eugene: Yes, I will deliver the token buffer and write integration tests by Thursday 5 PM.
Sarah: Marcus, what is your deadline for the multi-region fallback setup?
Marcus: I will have the Terraform scripts and regional failover health-checks ready by Wednesday noon.
Sarah: Perfect. Let's make sure we log all token usage metrics to Datadog so we can monitor cost per query. Marcus, take that on as well by end of sprint.
Eugene: One last thing—do we want to enforce mandatory JSON schema validation on all LLM tool calls?
Sarah: Yes, let's make that a strict requirement starting this release to avoid UI breakages. Eugene, add that to the engineering backlog for next sprint.
Sarah: Great sync everyone. Let's execute.`
  },
  {
    id: 'post-mortem',
    title: 'Production Incident Post-Mortem: DB Connection Saturation',
    duration: '30 mins',
    participants: ['Alex (Site Reliability)', 'Elena (Backend Lead)', 'David (Engineering Manager)'],
    transcript: `David: Thanks for jumping on quickly. Let's review the root cause of yesterday's 14-minute API degradation at 14:20 UTC.
Elena: The root cause was a sudden connection pool exhaustion on the primary PostgreSQL cluster. When the batch email campaign launched, 150 worker pods simultaneously spawned unbounded database connections.
Alex: Our connection pooler MaxClient limit was set to 500, but the spikes reached over 1,200 concurrent requests. The health checks started timing out, causing Kubernetes to enter a restart cascade.
David: What mitigated the incident?
Elena: Alex manually killed idle connections and temporarily capped worker concurrency at 50 jobs per replica. Full recovery was achieved at 14:34 UTC.
David: What are our permanent action items to ensure this never happens again?
Elena: We need to implement a dedicated PgBouncer connection proxy in transaction pooling mode. I will draft the architecture RFC by tomorrow morning.
Alex: And I will configure alerts in PagerDuty to trigger at 75% connection pool utilization, plus set hard memory limits on worker pods. I'll finish that by Friday.
David: Excellent. Let's also update the engineering runbook with step-by-step pool drainage procedures by Monday. Elena, please assign that to one of the senior backend engineers.`
  },
  {
    id: 'sales-discovery',
    title: 'Enterprise Discovery Call: FinTech Compliance SaaS',
    duration: '25 mins',
    participants: ['Rachel (Account Executive)', 'Tom (Chief Compliance Officer @ FinCorp)'],
    transcript: `Rachel: Hi Tom, thanks for taking the time today. Could you walk me through your biggest compliance bottlenecks right now?
Tom: Right now, our team audits over 5,000 wire transactions manually each week. We spend nearly 40 hours a week just cross-referencing sanction lists and flagging anomalies. We need an automated verification pipeline that meets SOC2 Type II and GDPR standards.
Rachel: Our platform provides automated real-time AML scoring and exports audit-ready logs with cryptographic signatures. How soon are you looking to implement a solution?
Tom: We have a compliance audit coming up in 60 days. If your team can provide a sandbox demo that handles our test dataset of 10,000 transactions by next Tuesday, we can proceed to contract review.
Rachel: I will set up a dedicated enterprise sandbox with custom mock data and send your technical team the API keys by this Friday at 3 PM.
Tom: Send the security whitepaper and SOC2 report to our legal counsel, Brenda, as well.
Rachel: Will do. I'll email Brenda the compliance package today by 5 PM and schedule our technical deep-dive for next Tuesday at 10 AM EST.`
  }
];