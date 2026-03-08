import logo from '../assets/logo.png';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-xl">
        <img src={logo} alt="Raithane Logo" className="h-16 w-auto object-contain" />
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#992a16] rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
}
