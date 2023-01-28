const emailTemplate = (token) => {
	const template = `
    <p>Verify your email address to see fully our content and many more.</p>
    <p>This link <b>expires in 6 hours.</b></p>
    <p>Press this <a href=http://localhost:5454/user/verify/${token}>link</a> to confirmation</p>
`;

	return template;
};

module.exports = emailTemplate;
