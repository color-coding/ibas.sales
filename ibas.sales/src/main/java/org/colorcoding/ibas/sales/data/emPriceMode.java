package org.colorcoding.ibas.sales.data;

import org.colorcoding.ibas.bobas.mapping.Value;

/**
 * 价格类型
 * 
 * @author Niuren.Zhu
 *
 */
public enum emPriceMode {
	/**
	 * 未税
	 */
	@Value("N")
	NET,
	/**
	 * 含税
	 */
	@Value("G")
	GROSS

}
