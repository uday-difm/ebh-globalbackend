import Image from 'next/image';
import Link from 'next/link';
import globeMark from '../../public/globe.svg';

const Logo = ({ withText = true, className = '', textClassName = '', iconClassName = 'h-12 w-12' }) => {
  return (
    <Link href="/" aria-label="Earth by Humans" className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`relative flex ${iconClassName} items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 p-2 shadow-sm`}>
        <Image src={globeMark} alt="Earth by Humans globe" width={32} height={32} priority={false} />
      </span>
      {withText ? (
        <span className={`text-xl font-semibold tracking-wide text-slate-900 ${textClassName}`}>
          Earth by Humans
        </span>
      ) : null}
    </Link>
  );
};

export default Logo;
