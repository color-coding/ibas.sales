package org.colorcoding.ibas.sales;

import org.colorcoding.ibas.bobas.configuration.ConfigurationFactory;
import org.colorcoding.ibas.bobas.configuration.IConfigurationManager;

/**
 * 我的配置项
 */
public class MyConfiguration extends org.colorcoding.ibas.initialfantasy.MyConfiguration {

	private volatile static IConfigurationManager instance;

	public static IConfigurationManager create() {
		if (instance == null) {
			synchronized (MyConfiguration.class) {
				if (instance == null) {
					instance = ConfigurationFactory.create().createManager();
					instance.setConfigSign(MODULE_ID);
					instance.update();
				}
			}
		}
		return instance;
	}

	public static <P> P getConfigValue(String key, P defaultValue) {
		return create().getConfigValue(key, defaultValue);
	}

	public static String getConfigValue(String key) {
		return create().getConfigValue(key);
	}

	private static Boolean inventoryUnitLinePrice = null;

	public static boolean isInventoryUnitLinePrice() {
		if (inventoryUnitLinePrice == null) {
			if ("InventoryUnit".equalsIgnoreCase(getConfigValue(CONFIG_ITEM_DOCUMENT_LINE_PRICE_TYPE))) {
				inventoryUnitLinePrice = true;
			} else {
				inventoryUnitLinePrice = false;
			}
		}
		return inventoryUnitLinePrice;
	}

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
	 * 配置项目-单据行价格类型
	 */
	public final static String CONFIG_ITEM_DOCUMENT_LINE_PRICE_TYPE = "documentLinePriceType";

	/**
	 * 配置项目-启用单据预留状态恢复
	 */
	public final static String CONFIG_ITEM_ENABLE_RESTORE_RESERVATION_STATUS = "enableRestoreReservationStatus";

}
