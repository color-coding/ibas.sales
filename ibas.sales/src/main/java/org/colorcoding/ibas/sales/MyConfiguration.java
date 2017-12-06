package org.colorcoding.ibas.sales;

/**
 * 我的配置项
 */
public class MyConfiguration extends org.colorcoding.ibas.bobas.MyConfiguration {
	/**
	 * 模块标识
	 */
	public static final String MODULE_ID = "bc24810f-da83-4e99-9252-d22bc28b614c";

	/**
	 * 命名空间
	 */
	public static final String NAMESPACE_ROOT = "http://colorcoding.org/ibas/sales/";

	/**
	 * 数据命名空间
	 */
	public static final String NAMESPACE_DATA = NAMESPACE_ROOT + "data";

	/**
	 * 业务对象命名空间
	 */
	public static final String NAMESPACE_BO = NAMESPACE_ROOT + "bo";

	/**
	 * 服务命名空间
	 */
	public static final String NAMESPACE_SERVICE = NAMESPACE_ROOT + "service";
	/**
	 * 配置项目-文件文件夹
	 */
	public final static String CONFIG_ITEM_SALES_FILE_FOLDER = "SLFileFolder";

}
