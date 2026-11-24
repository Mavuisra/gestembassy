"""Routes API back-office."""

from django.urls import path

from interfaces.api.backoffice.views import (
    AppointmentStatusView,
    AppointmentsStaffView,
    AuditListView,
    CitizensListView,
    DashboardView,
    DocumentDownloadView,
    FaqPublishView,
    FaqStaffView,
    IncidentDetailView,
    IncidentsView,
    NewsPublishView,
    NewsStaffView,
    RequestDetailView,
    RequestReplyView,
    RequestStatusView,
    RequestsListView,
    StaffLoginView,
    StaffMeView,
    StaffTeamView,
    StatsView,
)

urlpatterns = [
    path("auth/login/", StaffLoginView.as_view(), name="bo-login"),
    path("me/", StaffMeView.as_view(), name="bo-me"),
    path("dashboard/", DashboardView.as_view(), name="bo-dashboard"),
    path("stats/", StatsView.as_view(), name="bo-stats"),
    path("requests/", RequestsListView.as_view(), name="bo-requests"),
    path("requests/<str:case_type>/<str:reference>/", RequestDetailView.as_view(), name="bo-request-detail"),
    path(
        "requests/<str:case_type>/<str:reference>/status/",
        RequestStatusView.as_view(),
        name="bo-request-status",
    ),
    path(
        "requests/<str:case_type>/<str:reference>/reply/",
        RequestReplyView.as_view(),
        name="bo-request-reply",
    ),
    path("documents/<int:document_id>/download/", DocumentDownloadView.as_view(), name="bo-doc-download"),
    path("appointments/", AppointmentsStaffView.as_view(), name="bo-appointments"),
    path("appointments/<str:reference>/", AppointmentStatusView.as_view(), name="bo-appointment-status"),
    path("incidents/", IncidentsView.as_view(), name="bo-incidents"),
    path("incidents/<str:reference>/", IncidentDetailView.as_view(), name="bo-incident-detail"),
    path("users/", CitizensListView.as_view(), name="bo-users"),
    path("news/", NewsStaffView.as_view(), name="bo-news"),
    path("news/<int:news_id>/", NewsPublishView.as_view(), name="bo-news-publish"),
    path("faq/", FaqStaffView.as_view(), name="bo-faq"),
    path("faq/<int:faq_id>/", FaqPublishView.as_view(), name="bo-faq-publish"),
    path("audit/", AuditListView.as_view(), name="bo-audit"),
    path("staff/", StaffTeamView.as_view(), name="bo-staff"),
]
