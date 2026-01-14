/**
 * Format number to Indonesian Rupiah
 */
export function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Get greeting based on current hour
 */
export function getGreeting(): { greeting: string; isNight: boolean } {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) {
        return { greeting: 'Pagi', isNight: false };
    } else if (hour >= 11 && hour < 15) {
        return { greeting: 'Siang', isNight: false };
    } else if (hour >= 15 && hour < 18) {
        return { greeting: 'Sore', isNight: false };
    } else {
        return { greeting: 'Malam', isNight: true };
    }
}

/**
 * Debounce function for scroll handlers
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function for animation frames
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
