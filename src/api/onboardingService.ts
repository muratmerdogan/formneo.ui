import { OnboardingApi, OnboardRegisterRequest } from './generated';
import getConfiguration, { getConfigurationLogin } from '../confiuration';

// OnBoarding API servisi
class OnBoardingService {
    /**
     * Şirket kaydı oluşturur
     * @param registerData Kayıt verileri
     * @returns Promise<void>
     */
    async registerCompany(registerData: OnboardRegisterRequest): Promise<void> {
        try {
            // Şirket kaydı için token gerektirmeyen configuration kullan
            const onboardingApi = new OnboardingApi(getConfigurationLogin());
            await onboardingApi.apiOnboardingRegisterPost(registerData);
        } catch (error) {
            console.error('Company registration failed:', error);
            throw error;
        }
    }

    /**
     * Hesap aktivasyonu yapar
     * @param token Aktivasyon token'ı
     * @returns Promise<void>
     */
    async activateAccount(token: string): Promise<void> {
        try {
            // Aktivasyon için token gerektirmeyen configuration kullan
            const onboardingApi = new OnboardingApi(getConfigurationLogin());
            await onboardingApi.apiOnboardingActivateGet(token);
        } catch (error) {
            console.error('Account activation failed:', error);
            throw error;
        }
    }


    /**
     * Form verilerini OnboardRegisterRequest formatına dönüştürür
     * @param companyData Şirket verileri
     * @param adminData Admin verileri
     * @param selectedPlan Seçilen plan
     * @param agreedToTerms Şartları kabul etme durumu
     * @returns OnboardRegisterRequest
     */
    formatRegistrationData(
        companyData: {
            companyName: string;
            companyEmail: string;
            companyPhone: string;
            companyAddress: string;
            taxNumber: string;
            sector: string;
            employeeCount: string;
        },
        adminData: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            password: string;
        },
        selectedPlan: string,
        agreedToTerms: boolean
    ): OnboardRegisterRequest {
        return {
            company: {
                companyName: companyData.companyName,
                companyEmail: companyData.companyEmail,
                companyPhone: companyData.companyPhone || null,
                companyAddress: companyData.companyAddress || null,
                taxNumber: companyData.taxNumber || null,
                sector: companyData.sector,
                employeeCount: companyData.employeeCount || null,
            },
            admin: {
                firstName: adminData.firstName,
                lastName: adminData.lastName,
                email: adminData.email,
                phone: adminData.phone || null,
                password: adminData.password,
            },
            plan: selectedPlan,
            agreedToTerms: agreedToTerms,
        };
    }
}

// Singleton instance
const onBoardingService = new OnBoardingService();

export default onBoardingService;
export { OnBoardingService };
export type { OnboardRegisterRequest };
