import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function scrollToTarget(sectionId: string, router?: AppRouterInstance): void {
    const offset = window.innerWidth >= 768 ? 70 : 80;
    const currentPath = window.location.pathname;

    if (currentPath === '/') {
        const section = document.getElementById(sectionId);
        if (section) {
            const topPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: topPosition, behavior: 'smooth' });
        }
    } else if (router) {
        router.push('/');
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                const topPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: topPosition, behavior: 'smooth' });
            }
        }, 100);
    }
}

export function goToAndScroll(url: string, sectionId: string, router: AppRouterInstance): void {
    router.push(url);
    setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
            const offset = window.innerWidth >= 768 ? 70 : 80;
            const topPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: topPosition, behavior: 'smooth' });
        }
    }, 300);
}
