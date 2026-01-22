import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import HeroSidebar from '../../components/ui/HeroSidebar';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import logo from '../../assets/logo.png';

const ActivationStatusPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const confirmed = searchParams.get('confirmed');

  useEffect(() => {
    // If no confirmed parameter, redirect to sign-in
    if (!confirmed) {
      navigate('/sign-in', { replace: true });
    }
  }, [confirmed, navigate]);

  const getStatusConfig = () => {
    switch (confirmed) {
      case 'true':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: t('activation_success_title'),
          message: t('activation_success_message'),
          actionText: t('sign_in'),
          actionLink: '/sign-in',
          showResend: false,
        };
      case 'invalid':
        return {
          icon: XCircle,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: t('activation_invalid_title'),
          message: t('activation_invalid_message'),
          actionText: t('resend_activation'),
          actionLink: '/activation-instructions',
          showResend: true,
        };
      case 'already':
        return {
          icon: AlertCircle,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: t('activation_already_title'),
          message: t('activation_already_message'),
          actionText: t('sign_in'),
          actionLink: '/sign-in',
          showResend: false,
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config) {
    return null;
  }

  const IconComponent = config.icon;

  return (
    <PageTransition>
      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Gossip
              </span>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Status Content */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
              <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-8 shadow-lg`}>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`${config.iconColor} bg-white rounded-full p-4 shadow-md`}>
                    <IconComponent size={64} strokeWidth={2} />
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                  {config.title}
                </h1>

                {/* Message */}
                <p className="text-center text-gray-600 mb-8 leading-relaxed">
                  {config.message}
                </p>

                {/* Action Button */}
                <Link
                  to={config.actionLink}
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 text-center"
                >
                  {config.actionText}
                </Link>

                {/* Additional Help */}
                {config.showResend && (
                  <div className="mt-6 text-center text-sm text-gray-600">
                    <p>{t('activation_help_text')}</p>
                  </div>
                )}

                {/* Back to Sign In link for invalid/already cases */}
                {confirmed !== 'true' && (
                  <div className="mt-4 text-center">
                    <Link
                      to="/sign-in"
                      className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      {t('back_to_sign_in')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Quote Section */}
              <div className="mt-8 text-center">
                <p className="text-gray-500 italic text-sm">
                  {t('quote')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Sidebar */}
        <HeroSidebar />
      </div>
    </PageTransition>
  );
};

export default ActivationStatusPage;
