package org.colorcoding.ibas.sales.data;

import org.colorcoding.ibas.bobas.mapping.Value;

public enum emShippingStatus {

	/**
	 * 等待
	 */
	@Value("W")
	WAITING,
	/**
	 * 运输中
	 */
	@Value("I")
	SHIPPING,
	/**
	 * 已送达
	 */
	@Value("D")
	SHIPPED,
}
