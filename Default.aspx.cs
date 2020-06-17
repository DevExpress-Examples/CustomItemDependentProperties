using DevExpress.DashboardCommon;
using DevExpress.DashboardWeb;
using DevExpress.DataAccess.Sql;
using System;

public partial class Default : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
        ASPxDashboard1.SetDataSourceStorage(CreateDataSourceStorage());
    }

    public DataSourceInMemoryStorage CreateDataSourceStorage() {
        DataSourceInMemoryStorage dataSourceStorage = new DataSourceInMemoryStorage();

        DashboardSqlDataSource sqlDataSource = new DashboardSqlDataSource("SQL Data Source", "NWindConnectionString");
        SelectQuery query = SelectQueryFluentBuilder
            .AddTable("Products")
            .SelectAllColumnsFromTable()
            .Build("Products");
        sqlDataSource.Queries.Add(query);
        dataSourceStorage.RegisterDataSource("sqlDataSource", sqlDataSource.SaveToXml());

        return dataSourceStorage;
    }
}