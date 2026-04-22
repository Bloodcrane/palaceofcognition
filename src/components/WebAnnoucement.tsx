'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface WebAnnoucementProps {
    imageUrl?: string;
    title: string;
    description: string;
    author?: string;
}

const WebAnnoucement: React.FC<WebAnnoucementProps> = ({ imageUrl, title, description, author }) => {
    const router = useRouter();

    const handleSignInRedirect = () => {
        router.push('/signup');
    };

    return (
        <div className="latestNews">
            {imageUrl && (
                <div style={{ position: 'relative', gridRow: '1 / 5', gridColumn: '1' }}>
                    <Image
                        src={imageUrl}
                        fill
                        alt=""
                        sizes="480px"
                        style={{ objectFit: 'cover', opacity: 0.4, filter: 'blur(8px)' }}
                    />
                </div>
            )}
            <div className="webComponent-overlay">
                <h1 className="webComponent-title">{title}</h1>
                {author && (
                    <Link href="/profile/697e9164002cfe5d9083" className="webComponent-author" style={{ textDecoration: 'none', color: '#598eff' }}>
                        {author}
                    </Link>
                )}
                <label className="webComponent-description">{description}</label>
            </div>
            {imageUrl && (
                <div style={{ position: 'relative', gridRow: '2', gridColumn: '1', width: '100%', height: '250px' }}>
                    <Image
                        src={imageUrl}
                        fill
                        alt=""
                        sizes="480px"
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            )}
            <div className="compact-button-row" style={{ justifyContent: 'center' }}>
                <button className="compact-button" onClick={handleSignInRedirect}>
                    ახალი ანგარიშის შექმნა
                </button>
            </div>
        </div>
    );
};

export default WebAnnoucement;
