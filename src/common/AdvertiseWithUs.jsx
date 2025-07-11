import { BsGraphUpArrow } from 'react-icons/bs';
import { FaUsers, FaPuzzlePiece, FaLightbulb, FaHandHoldingHeart } from 'react-icons/fa';
import { MdOutlineMaximize } from 'react-icons/md';

export default function AdvertiseWithUs() {
  // This array contains all six feature cards
  const features = [
    {
        icon: <BsGraphUpArrow className="text-green-500" size={36} />,
        title: "Boost Your Brand",
        description: "Advertise with us and connect with an audience passionate about nature and science. Our trusted platform is perfect for enhancing your brand's visibility.",
    },
    {
        icon: <FaUsers className="text-green-500" size={36} />,
        title: "Reach a Highly Engaged Audience",
        description: "Connect with a community that values authenticity and depth. Our readers are more likely to respond to your message and support brands that share their values.",
    },
    {
        icon: <MdOutlineMaximize className="text-green-500" size={36} />,
        title: "Maximize Your Impact",
        description: "Utilize our multi-channel approach, reaching a wide audience through our print and digital magazines, website, and social media platforms for comprehensive exposure.",
    },
    {
        icon: <FaPuzzlePiece className="text-green-500" size={36} />,
        title: "Engage Through Interactive Content",
        description: "Tap into our popular quiz section, offering fun and educational quizzes on nature and science. Create memorable brand associations and engage your target audience uniquely.",
    },
    {
        icon: <FaLightbulb className="text-green-500" size={36} />,
        title: "Leverage Our Blog for Thought Leadership",
        description: "Advertise alongside our insightful blog content, positioning your brand as knowledgeable and credible. Our readers seek the latest in nature and science.",
    },
    {
        icon: <FaHandHoldingHeart className="text-green-500" size={36} />,
        title: "Join a Mission-Driven Platform",
        description: "Align your brand with our mission to heal and understand the planet. Partner with Earth by Humans to enhance your brand's reputation and impact.",
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4 max-w-[1350]">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Advertise With Us!</h2>
            <p className="max-w-3xl mx-auto text-gray-600 mb-12">
                Ready to take your brand to the next level? Partner with us to create campaigns that captivate and convert.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                        <div className="mb-5">{feature.icon}</div>
                        <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}