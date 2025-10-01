import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShieldIcon from '@mui/icons-material/Shield';
import ReplayIcon from '@mui/icons-material/Replay';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const guarantees = [
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 36, color: '#1976d2' }} />,
    title: "Verified Professionals",
  },
  {
    icon: <ShieldIcon sx={{ fontSize: 36, color: '#43a047' }} />,
    title: "Insured Work",
  },
  {
    icon: <ReplayIcon sx={{ fontSize: 36, color: '#fbc02d' }} />,
    title: "Re-work Assurance",
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 36, color: '#7b1fa2' }} />,
    title: "On-Time Support",
  },
  {
    icon: <CoronavirusIcon sx={{ fontSize: 36, color: '#e91e63' }} />,
    title: "Covid-19 Safety",
  },
];

const Guranted = () => {
  return (
    <section className="w-full py-14 px-2 md:px-10">
      <div className="flex flex-col items-center mb-8">
        {/* Guarantee Badge */}
        <div className="bg-yellow-400 rounded-full w-20 h-20 flex items-center justify-center shadow-lg mb-4 border-4 border-white">
          <CheckCircleIcon sx={{ fontSize: 48, color: 'white' }} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Guarantee</h2>
        <p className="text-gray-600 text-center max-w-md">
          We stand by our service quality and your safety. Here’s what we guarantee for every customer:
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-8">
        {guarantees.map((g, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-5 flex flex-col items-center gap-2 border border-blue-100 hover:shadow-xl transition"
          >
            <div className="mb-2">{g.icon}</div>
            <div className="font-semibold text-gray-700 text-center">{g.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Guranted;