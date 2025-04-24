package org.colorcoding.ibas.sales.data;

import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.common.Value;
import org.colorcoding.ibas.sales.MyConfiguration;

@XmlType(namespace = MyConfiguration.NAMESPACE_BO)
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
