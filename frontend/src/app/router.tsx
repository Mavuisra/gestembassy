import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BackofficeLayout } from "../shared/layout/BackofficeLayout";
import { PublicLayout } from "../shared/layout/PublicLayout";
import { AccountDashboardPage } from "../pages/account/AccountDashboardPage";
import { AppointmentsPage } from "../pages/account/AppointmentsPage";
import { CasesPage } from "../pages/account/CasesPage";
import { HistoryPage } from "../pages/account/HistoryPage";
import { LoginPage } from "../pages/account/LoginPage";
import { NotificationsPage } from "../pages/account/NotificationsPage";
import { PassportRequestPage } from "../pages/account/PassportRequestPage";
import { ProfilePage } from "../pages/account/ProfilePage";
import { RegisterPage } from "../pages/account/RegisterPage";
import { VisaPreApplicationDetailPage } from "../pages/account/VisaPreApplicationDetailPage";
import { VisaPreApplicationListPage } from "../pages/account/VisaPreApplicationListPage";
import { VisaPreApplicationPage } from "../pages/account/VisaPreApplicationPage";
import { BackofficeAppointmentsPage } from "../pages/backoffice/AppointmentsPage";
import { BackofficeNewsPage, BackofficeFaqPage } from "../pages/backoffice/ContentPages";
import { BackofficeDashboardPage } from "../pages/backoffice/DashboardPage";
import { BackofficeDocumentsPage } from "../pages/backoffice/DocumentsPage";
import { BackofficeIncidentDetailPage } from "../pages/backoffice/IncidentDetailPage";
import { BackofficeIncidentsPage } from "../pages/backoffice/IncidentsPage";
import { BackofficeRequestDetailPage } from "../pages/backoffice/RequestDetailPage";
import { BackofficeRequestsPage } from "../pages/backoffice/RequestsPage";
import { StaffLoginPage } from "../pages/backoffice/StaffLoginPage";
import {
 BackofficeAuditPage,
 BackofficeStatsPage,
 BackofficeTeamPage,
} from "../pages/backoffice/StatsAuditTeamPages";
import { BackofficeUsersPage } from "../pages/backoffice/UsersPage";
import { AssistancePage } from "../pages/public/AssistancePage";
import { ContactPage } from "../pages/public/ContactPage";
import { EmbassyPage } from "../pages/public/EmbassyPage";
import { FaqPage } from "../pages/public/FaqPage";
import { HomePage } from "../pages/public/HomePage";
import { InvestPage } from "../pages/public/InvestPage";
import { NewsDetailPage } from "../pages/public/NewsDetailPage";
import { NewsPage } from "../pages/public/NewsPage";
import { CivilStatusPage } from "../pages/public/CivilStatusPage";
import { ConsularRegistrationPage } from "../pages/public/ConsularRegistrationPage";
import { PassportPage } from "../pages/public/PassportPage";
import { ServiceDetailPage } from "../pages/public/ServiceDetailPage";
import { ServicesPage } from "../pages/public/ServicesPage";
import { NotFoundPage } from "../pages/public/NotFoundPage";
import { VisasPage } from "../pages/public/VisasPage";

export function AppRouter() {
 return (
 <BrowserRouter>
 <Routes>
 <Route path="backoffice/login" element={<StaffLoginPage />} />
 <Route path="backoffice" element={<BackofficeLayout />}>
 <Route index element={<BackofficeDashboardPage />} />
 <Route path="demandes" element={<BackofficeRequestsPage />} />
 <Route path="demandes/:caseType/:reference" element={<BackofficeRequestDetailPage />} />
 <Route path="rendez-vous" element={<BackofficeAppointmentsPage />} />
 <Route path="incidents" element={<BackofficeIncidentsPage />} />
 <Route path="incidents/:reference" element={<BackofficeIncidentDetailPage />} />
 <Route path="usagers" element={<BackofficeUsersPage />} />
 <Route path="actualites" element={<BackofficeNewsPage />} />
 <Route path="faq" element={<BackofficeFaqPage />} />
 <Route path="documents" element={<BackofficeDocumentsPage />} />
 <Route path="stats" element={<BackofficeStatsPage />} />
 <Route path="audit" element={<BackofficeAuditPage />} />
 <Route path="equipe" element={<BackofficeTeamPage />} />
 </Route>

 <Route element={<PublicLayout />}>
 <Route index element={<HomePage />} />
 <Route path="ambassade" element={<EmbassyPage />} />
 <Route path="services" element={<ServicesPage />} />
 <Route path="services/passeport" element={<PassportPage />} />
 <Route path="services/enregistrement-consulaire" element={<ConsularRegistrationPage />} />
 <Route path="services/etat-civil" element={<CivilStatusPage />} />
 <Route path="services/:slug" element={<ServiceDetailPage />} />
 <Route path="visas" element={<VisasPage />} />
 <Route path="actualites" element={<NewsPage />} />
 <Route path="actualites/:slug" element={<NewsDetailPage />} />
 <Route path="investir" element={<InvestPage />} />
 <Route path="assistance" element={<AssistancePage />} />
 <Route path="faq" element={<FaqPage />} />
 <Route path="contact" element={<ContactPage />} />
 <Route path="compte" element={<AccountDashboardPage />} />
 <Route path="compte/inscription" element={<RegisterPage />} />
 <Route path="compte/connexion" element={<LoginPage />} />
 <Route path="compte/profil" element={<ProfilePage />} />
 <Route path="compte/visas" element={<VisaPreApplicationListPage />} />
 <Route path="compte/visas/nouvelle" element={<VisaPreApplicationPage />} />
 <Route path="compte/visas/:reference" element={<VisaPreApplicationDetailPage />} />
 <Route path="compte/dossiers" element={<CasesPage />} />
 <Route path="compte/passeport" element={<PassportRequestPage />} />
 <Route path="compte/rendez-vous" element={<AppointmentsPage />} />
 <Route path="compte/notifications" element={<NotificationsPage />} />
 <Route path="compte/historique" element={<HistoryPage />} />
 <Route path="*" element={<NotFoundPage />} />
 </Route>
 </Routes>
 </BrowserRouter>
 );
}
