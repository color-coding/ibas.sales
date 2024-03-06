package org.colorcoding.ibas.sales.data;

import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.mapping.Value;
import org.colorcoding.ibas.sales.MyConfiguration;

/**
 * 价格类型
 * 
 * @author Niuren.Zhu
 *
 */
@XmlType(namespace = MyConfiguration.NAMESPACE_BO)
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
