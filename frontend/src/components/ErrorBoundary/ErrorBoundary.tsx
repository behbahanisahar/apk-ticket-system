import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { BG, TEXT, BORDER } from '../../theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={`flex min-h-screen items-center justify-center ${BG.page} p-4`}>
          <div className={`w-full max-w-md rounded-2xl border ${BORDER.default} ${BG.surface} p-8 text-center shadow-xl`}>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className={`mb-2 text-xl font-bold ${TEXT.heading}`}>
              خطایی رخ داده است
            </h1>
            
            <p className={`mb-6 ${TEXT.muted}`}>
              متأسفانه مشکلی در نمایش این صفحه وجود دارد. لطفاً دوباره تلاش کنید.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className={`mb-6 rounded-lg ${BG.muted} p-4 text-start`}>
                <p className={`mb-2 text-xs font-semibold ${TEXT.muted}`}>جزئیات خطا (فقط در حالت توسعه):</p>
                <pre className="overflow-auto text-xs text-red-600" dir="ltr">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="h-4 w-4" />
                تلاش مجدد
              </Button>
              <Button onClick={this.handleReload} variant="outline">
                <RefreshCw className="h-4 w-4" />
                بارگذاری مجدد صفحه
              </Button>
              <Button onClick={this.handleGoHome}>
                <Home className="h-4 w-4" />
                صفحه اصلی
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
