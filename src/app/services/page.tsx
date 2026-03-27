import Link from "next/link";
import LoginDropdown from "@/components/ui/LoginDropdown";
import Footer from "@/components/layout/Footer";

const sections = [
  {
    title: "Primary Care and Internal Medicine",
    color: "#0284c7",
    bg: "#e0f2fe",
    services: [
      { name: "General Physician/Medicine", desc: "Primary care for adults and complex health conditions." },
    ],
  },
  {
    title: "Specialized Medical Departments",
    color: "#7c3aed",
    bg: "#f5f3ff",
    services: [
      { name: "Cardiology", desc: "Heart and blood vessel conditions (e.g., heart failure, hypertension)." },
      { name: "Neurology", desc: "Disorders of the brain, spinal cord, and nerves (e.g., stroke, epilepsy)." },
      { name: "Endocrinology/Diabetology", desc: "Hormonal disorders, metabolism, and diabetes." },
      { name: "Gastroenterology", desc: "Diseases of the digestive system (esophagus, stomach, liver, intestines)." },
      { name: "Pulmonology", desc: "Lung and respiratory system disorders (e.g., asthma, COPD)." },
      { name: "Oncology", desc: "Cancer treatment (Medical, Surgical, or Radiation Oncology)." },
      { name: "Hematology", desc: "Blood disorders and blood-forming organs." },
      { name: "Nephrology", desc: "Kidney diseases and hypertension." },
      { name: "Rheumatology", desc: "Autoimmune and inflammatory diseases affecting joints and muscles." },
      { name: "Dermatology", desc: "Skin, hair, and nail conditions." },
      { name: "Psychiatry", desc: "Mental health and behavioral disorders." },
    ],
  },
  {
    title: "Surgical Specialties",
    color: "#dc2626",
    bg: "#fee2e2",
    services: [
      { name: "General Surgery", desc: "Abdominal, breast, skin, and soft tissue surgery." },
      { name: "Orthopedics", desc: "Musculoskeletal system (bones, joints, ligaments)." },
      { name: "Neurosurgery", desc: "Surgery of the brain and spinal cord." },
      { name: "Urology", desc: "Urinary tract and male reproductive system." },
      { name: "Cardiothoracic Surgery", desc: "Surgery of the heart, lungs, and chest." },
      { name: "Plastic and Cosmetic Surgery", desc: "Reconstructive and aesthetic procedures." },
      { name: "Ophthalmology", desc: "Eye care and surgery." },
      { name: "Ear, Nose, and Throat (ENT) / Otolaryngology", desc: "Conditions of the head and neck." },
      { name: "Obstetrics & Gynecology (OB-GYN)", desc: "Women's reproductive health, pregnancy, and childbirth." },
    ],
  },
  {
    title: "Pediatric Departments",
    color: "#059669",
    bg: "#d1fae5",
    services: [
      { name: "Pediatrics", desc: "Comprehensive medical care for infants, children, and teenagers." },
      { name: "Neonatology & NICU", desc: "Care for newborns, particularly those who are premature or critically ill." },
      { name: "Paediatric Surgery", desc: "Surgical procedures for children." },
    ],
  },
  {
    title: "Critical Care and Emergency Services",
    color: "#d97706",
    bg: "#fef3c7",
    services: [
      { name: "Accident and Emergency (A&E) Care", desc: "24/7 care for acute trauma and sudden illnesses." },
      { name: "Critical Care/ICU", desc: "Intensive care for critically injured or ill patients." },
      { name: "Anesthesiology", desc: "Pain relief and management during surgeries and procedures." },
    ],
  },
  {
    title: "Diagnostic and Other Services",
    color: "#0891b2",
    bg: "#cffafe",
    services: [
      { name: "Radiology", desc: "Imaging (X-ray, CT Scan, MRI, Ultrasound)." },
      { name: "Pathology/Laboratory Medicine", desc: "Examination of tissue samples and body fluids." },
      { name: "Physiotherapy/Rehabilitation", desc: "Improving function for patients with physical limitations." },
      { name: "Nuclear Medicine", desc: "Use of radioactive materials for diagnosis and treatment." },
      { name: "Transfusion Medicine", desc: "Blood banking and transfusion services." },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <style>{`
        body { background-color: #f8fafc; }
        .nav-link { color: #64748b; transition: all 0.2s; font-size: 14px; font-weight: 500; padding: 6px 12px; border-radius: 8px; border: 1px solid transparent; }
        .nav-link:hover { color: #0284c7; background-color: #f0f9ff; border-color: #bae6fd; }
      `}</style>

      <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>

        {/* Navbar */}
        <nav style={{ backgroundColor: "rgba(255,255,255,0.9)", borderBottom: "1px solid #e2e8f0", backdropFilter: "blur(12px)" }} className="sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-lg font-black text-gray-900">MediCare</span>
              <span className="text-xs text-gray-400 hidden sm:inline">Hospital Management</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/doctors" className="nav-link">Doctors</Link>
              <Link href="/services" className="nav-link" style={{ color: "#0284c7", backgroundColor: "#f0f9ff", borderColor: "#bae6fd" }}>Services</Link>
              <Link href="/#about" className="nav-link">About</Link>
              <Link href="/#contact" className="nav-link">Contact</Link>
            </div>
            <LoginDropdown />
          </div>
        </nav>

        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: "#0284c7", backgroundColor: "#e0f2fe" }}>Our Services</span>
          <h1 className="text-3xl font-black text-gray-900 mt-3">Medical Departments & Services</h1>
          <p className="text-sm text-gray-500 mt-2">Expert care across all major medical disciplines</p>
        </div>

        {/* Sections */}
        <div className="max-w-7xl mx-auto px-6 pb-16 space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: section.color }} />
                <h2 className="text-lg font-black text-gray-900">{section.title}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.services.map((s) => (
                  <div key={s.name} className="bg-white rounded-2xl p-5 transition-all hover:shadow-md" style={{ border: "1px solid #e2e8f0" }}>
                    <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: section.color }} />
                    <h3 className="font-bold text-sm text-gray-900 mb-1">{s.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </>
  );
}
