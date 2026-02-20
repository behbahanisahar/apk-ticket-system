import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Normal content</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('خطایی رخ داده است')).toBeInTheDocument();
    expect(screen.getByText(/متأسفانه مشکلی در نمایش این صفحه/)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error fallback</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
  });

  it('shows recovery buttons', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('تلاش مجدد')).toBeInTheDocument();
    expect(screen.getByText('بارگذاری مجدد صفحه')).toBeInTheDocument();
    expect(screen.getByText('صفحه اصلی')).toBeInTheDocument();
  });

  it('resets error state when clicking retry with fixed children', () => {
    let shouldThrow = true;
    
    const ThrowOnce = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>Normal content</div>;
    };
    
    render(
      <ErrorBoundary>
        <ThrowOnce />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('خطایی رخ داده است')).toBeInTheDocument();
    
    shouldThrow = false;
    fireEvent.click(screen.getByText('تلاش مجدد'));
    
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });
});
