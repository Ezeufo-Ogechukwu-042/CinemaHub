import { supabase } from "../supabase/client";

const fallbackContact = {
  address: "12B Allen Avenue, Ikeja, Lagos, Nigeria",
  phone: "+234 810 000 0000",
  email: "support@cinemahub.ng",
  supportHours: "Mon–Sat, 8:00 AM – 10:00 PM WAT",
};

const fallbackFaqs = [
  {
    question: "How do I access my movie purchases?",
    answer: "Visit your profile to view and manage your purchased movies at any time.",
  },
  {
    question: "Can I request a refund?",
    answer: "Refund requests are reviewed by our support team and usually resolved within one business day.",
  },
  {
    question: "Do you support streaming and downloads?",
    answer: "Yes, eligible purchases can be streamed instantly and downloaded for offline viewing when supported.",
  },
];

const fallbackTeam = [
  {
    name: "Ava Chen",
    role: "Head of Product",
    image: "",
  },
  {
    name: "Noah Silva",
    role: "Engineering Lead",
    image: "",
  },
  {
    name: "Mia Alvarez",
    role: "Customer Experience",
    image: "",
  },
  {
    name: "Jay Patel",
    role: "Operations",
    image: "",
  },
];

export const contentService = {
  async getContactPage() {
    const contact = {
      address: import.meta.env.VITE_CONTACT_ADDRESS || fallbackContact.address,
      phone: import.meta.env.VITE_CONTACT_PHONE || fallbackContact.phone,
      email: import.meta.env.VITE_CONTACT_EMAIL || fallbackContact.email,
      supportHours: import.meta.env.VITE_CONTACT_SUPPORT_HOURS || fallbackContact.supportHours,
    };

    return {
      contact,
      faqs: fallbackFaqs,
    };
  },

  async getAboutPage() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar, role")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;

      const team = (data || [])
        .filter((member) => member.full_name || member.role)
        .slice(0, 4)
        .map((member) => ({
          name: member.full_name || member.role || "CinemaHub Team",
          role: member.role || "Team Member",
          image: member.avatar || "",
        }));

      return {
        team: team.length ? team : fallbackTeam,
      };
    } catch (error) {
      return {
        team: fallbackTeam,
      };
    }
  },
};
