/**
 * data.js
 * ----------------------------------------------------------------
 * Central telemetry data store for the console.
 * Everything is modeled as flat hash maps (plain objects) so any
 * lookup — by id, by section, by skill key — is O(1) instead of
 * looping through arrays at render/animation time.
 * ----------------------------------------------------------------
 */

const IDENTITY = {
  name: "Suraj Kumar S",
  role: "AWS DevOps Engineer",
  subrole: "Site Reliability & Cloud Automation",
  location: "Bengaluru, India",
  email: "iamsuraj252@gmail.com",
  phone: "+91 9113898952",
  linkedin: "linkedin.com/in/suraj-kumar-s-39751b393",
  linkedinUrl: "https://linkedin.com/in/suraj-kumar-s-39751b393",
  summary:
    "DevOps engineer running AWS infrastructure (EC2, EKS, ECS, Terraform, CI/CD) with a production reliability background from Azure enterprise environments. Ships automation that removes manual toil and keeps systems observable.",
  status: "AVAILABLE — IMMEDIATE JOINER — BENGALURU / ONSITE",
};

/**
 * SKILL_MAP: keyed by track id -> O(1) lookup for the HUD renderer.
 * `level` (0-100) drives both the chart value and the staggered counter.
 */
const SKILL_MAP = {
  cloud: {
    id: "cloud",
    label: "CLOUD PLATFORMS",
    unit: "AWS / AZURE",
    level: 92,
    items: [
      "AWS EC2", "AWS S3", "AWS RDS", "AWS Lambda", "AWS VPC",
      "AWS ECS", "AWS EKS", "AWS ECR", "AWS IAM", "Route 53",
      "Azure AD", "Azure RBAC", "Conditional Access", "App Services", "VNets",
    ],
  },
  iac: {
    id: "iac",
    label: "DEVOPS & IaC",
    unit: "AUTOMATION",
    level: 90,
    items: ["Terraform", "CloudFormation", "Jenkins", "GitHub Actions", "AWS CodePipeline", "Azure DevOps"],
  },
  observability: {
    id: "observability",
    label: "OBSERVABILITY CORE",
    unit: "TELEMETRY",
    level: 85,
    items: ["Prometheus", "Grafana", "Splunk", "Kibana", "CloudWatch", "Azure Monitor"],
  },
  systems: {
    id: "systems",
    label: "NETWORKING & SYSTEMS",
    unit: "FOUNDATIONS",
    level: 80,
    items: ["CCNA-level networking", "Linux administration", "Python", "Bash", "PowerShell"],
  },
};

/**
 * TIMELINE_MAP: keyed by role id, ordered via `order` field.
 * Each entry is a "track log" the UI reads sequentially.
 */
const TIMELINE_MAP = {
  dxc: {
    id: "dxc",
    order: 1,
    org: "DXC Technology",
    role: "Infrastructure Analyst — MetLife Contract",
    period: "DEC 2024 — DEC 2025",
    lat: "PRODUCTION RELIABILITY",
    points: [
      "Owned high-priority incident response and 24/7 on-call rotation across critical production microservices.",
      "Built Python and Bash automation that cut diagnostic and RCA turnaround time by 30%.",
      "Deployed real-time observability dashboards with Azure Monitor, Prometheus, and Grafana.",
      "Led access governance and secrets-management hardening under least-privilege configurations.",
      "Authored runbooks and SOPs enabling product teams to self-diagnose environment issues.",
    ],
  },
  aws: {
    id: "aws",
    order: 2,
    org: "AWS Cloud Infrastructure & Automation",
    role: "Project-Based Training",
    period: "JAN 2026 — PRESENT",
    lat: "CLOUD-NATIVE BUILD",
    points: [
      "Built end-to-end CI/CD pipelines with GitHub Actions, Jenkins, and AWS CodePipeline for zero-downtime deploys.",
      "Provisioned production-ready AWS environments from scratch with Terraform — zero config drift across EC2, S3, RDS, VPC.",
      "Orchestrated containerized workloads on EKS and ECS for scalable service delivery.",
      "Centralized logging via Splunk and Kibana alongside Prometheus/Grafana.",
      "Cut compute and storage spend through EC2 right-sizing, S3 lifecycle tiering, and autoscaling triggers.",
    ],
  },
};

/**
 * PROJECT_MAP: keyed by project id.
 */
const PROJECT_MAP = {
  quickcart: {
    id: "quickcart",
    name: "QuickCart",
    tag: "SERVERLESS E-COMMERCE PLATFORM",
    period: "JAN 2026 — PRESENT",
    description:
      "A greenfield, multi-service commerce platform built solo end-to-end — from container boundaries to production security posture.",
    microservices: ["Auth", "Product", "Cart", "Order", "Payment", "Email"],
    stack: ["AWS EKS Fargate", "Amazon ECS", "Terraform", "IRSA / OIDC", "AWS Load Balancer Controller", "React.js", "S3 + CloudFront"],
    points: [
      "Engineered 6 containerized Node.js microservices deployed across EKS Fargate and ECS.",
      "Automated full environment provisioning with modular Terraform — single-command setup.",
      "Locked down per-service network boundaries with IRSA/OIDC least-privilege security.",
      "Configured AWS Load Balancer Controller for path-based routing.",
      "Delivered fast-loading frontend assets via React.js, S3, and CloudFront.",
    ],
  },
  devopsconsole: {
    id: "devopsconsole",
    name: "DevOps Engineering Console",
    tag: "INTERACTIVE TERMINAL & OBSERVABILITY HUB",
    period: "MAY 2026 — PRESENT",
    description:
      "The very portfolio platform you are navigating—a cinematic, terminal-inspired cloud dashboard built to map real-world systems telemetry and interactive animation layouts.",
    microservices: ["Console-UI", "Telemetry-Engine"],
    stack: ["HTML5", "CSS3", "JavaScript (ES6)", "GSAP", "Chart.js", "GitHub Actions"],
    points: [
      "Designed a high-fidelity 'Lights Out' pre-loader sequence mirroring real race-telemetry start sequences.",
      "Architecting modular asset routing pipelines ensuring clean separation between JS configurations and UI styles.",
      "Integrating immersive timeline tracking and GSAP motion mechanics for interactive user engagement queues.",
    ],
  },
  netflixpipeline: {
    id: "netflixpipeline",
    name: "Netflix DevSecOps Platform",
    tag: "SECURE CI/CD & WORKLOAD ORCHESTRATION",
    period: "JUN 2026 — IN PROGRESS",
    description:
      "A high-availability microservices streaming architecture wrapped inside a modern DevSecOps automated pipeline with deep compliance rules.",
    microservices: ["UI-Gateway", "Auth-Secure", "Stream-Engine", "Discovery-Service"],
    stack: ["Jenkins", "Docker", "Kubernetes (EKS)", "SonarQube", "Trivy", "OWASP ZAP", "Prometheus"],
    points: [
      "Constructing automated declarative deployment pipelines enforcing security scans at every stage.",
      "Integrating continuous vulnerability checks using Trivy image auditing and SonarQube static code metrics.",
      "Configuring robust rolling orchestration frameworks on container clusters to handle seamless staging rollouts.",
    ],
  },
};

/**
 * CERT_MAP: keyed by cert code.
 */
const CERT_MAP = {
  az400: { id: "az400", code: "AZ-400", name: "DevOps Engineer Expert", issuer: "Microsoft" },
  az204: { id: "az204", code: "AZ-204", name: "Azure Developer Associate", issuer: "Microsoft" },
  az900: { id: "az900", code: "AZ-900", name: "Azure Fundamentals", issuer: "Microsoft" },
  besant: { id: "besant", code: "CLOUD-CC", name: "Cloud Computing Certification", issuer: "Besant Technologies" },
};

const EDUCATION = {
  degree: "Bachelor of Computer Applications (BCA)",
  school: "New Horizon College, Bengaluru",
};

// Freeze all maps — this data is read-only telemetry, never mutated at runtime.
[SKILL_MAP, TIMELINE_MAP, PROJECT_MAP, CERT_MAP, IDENTITY, EDUCATION].forEach(Object.freeze);
