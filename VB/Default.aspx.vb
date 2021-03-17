Imports DevExpress.DashboardCommon
Imports DevExpress.DashboardWeb
Imports DevExpress.DataAccess.Sql
Imports System

Partial Public Class [Default]
	Inherits System.Web.UI.Page

	Protected Sub Page_Load(ByVal sender As Object, ByVal e As EventArgs)
		ASPxDashboard1.SetDataSourceStorage(CreateDataSourceStorage())
	End Sub

	Public Function CreateDataSourceStorage() As DataSourceInMemoryStorage
		Dim dataSourceStorage As New DataSourceInMemoryStorage()

		Dim sqlDataSource As New DashboardSqlDataSource("SQL Data Source", "NWindConnectionString")
		Dim query As SelectQuery = SelectQueryFluentBuilder.AddTable("Products").SelectAllColumnsFromTable().Build("Products")
		sqlDataSource.Queries.Add(query)
		dataSourceStorage.RegisterDataSource("sqlDataSource", sqlDataSource.SaveToXml())

		Return dataSourceStorage
	End Function
End Class